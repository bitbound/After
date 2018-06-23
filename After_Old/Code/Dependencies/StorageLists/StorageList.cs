using After.Dependencies;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Timers;

namespace After.Dependencies.StorageLists
{
    public class StorageList<T> where T : IStorageItem
    {
        public StorageList()
        {
            SaveTimer = new Timer(SaveInterval);
            SaveTimer.Elapsed += SaveTimer_Elapsed;
            SaveTimer.Start();
        }

        /// <summary>
        /// The folder within which items of type T will be saved.
        /// </summary>
        public string FolderPath { get; set; }

        /// <summary>
        /// The length of time to hold items in Storage (in memory) before persisting them.
        /// </summary>
        public TimeSpan MemCacheTime { get; set; } = TimeSpan.FromMinutes(3);

        /// <summary>
        /// If predicate returns true for item, it will be saved to disk.  Otherwise, it will only be retained in memory.
        /// </summary>
        public Predicate<T> PersistenceFilter { get; set; } = new Predicate<T>((temp) => { return true; });

        /// <summary>
        /// An action to perform if there's a failure writing to disk.  By default, everything is retained in memory.
        /// </summary>
        public Action PersistErrorAction { get; set; } = new Action(() => { });

        /// <summary>
        /// How often, in milliseconds, to persist items in Storage.  The default is 5 minutes.
        /// </summary>
        public double SaveInterval
        {
            get
            {
                if (SaveTimer == null)
                {
                    return 600000;
                }
                else
                {
                    return SaveTimer.Interval;
                }
            }
            set
            {
                if (SaveTimer == null)
                {
                    SaveTimer = new Timer(value);
                }
                else
                {
                    SaveTimer.Stop();
                    SaveTimer.Dispose();
                    SaveTimer = new Timer(value);
                }
                SaveTimer.Elapsed += SaveTimer_Elapsed;
                SaveTimer.Start();
            }
        }

        /// <summary>
        /// Items in memory.  This will not return persisted items that haven't been loaded into memory.
        /// </summary>
        public SortedList<string, T> Storage { get; set; } = new SortedList<string, T>();

        private object FileSystemLock { get; set; } = new object();
        /// <summary>
        /// Timer that will persist items in Storage every interval.
        /// </summary>
        private Timer SaveTimer { get; set; }

        private object StorageLock { get; set; } = new object();


        /// <summary>
        /// Returns the total number of records.
        /// </summary>
        /// <returns></returns>
        public int Count()
        {
            if (FolderPath == null)
            {
                throw new Exception("FolderPath must have a value.");
            }
            StoreAll();
            var count = 0;
            lock (FileSystemLock)
            {
                var di = Directory.CreateDirectory(FolderPath);
                count += di.EnumerateFiles().Count();
            }
            return count;
        }



        /// <summary>
        /// Add new item to Storage.
        /// </summary>
        /// <param name="newItem"></param>
        public void Add(T newItem)
        {
            if (FolderPath == null)
            {
                throw new Exception("FolderPath must have a value.");
            }
            if (!(newItem is IStorageItem))
            {
                throw new Exception("Item must implement interface IStorageItem.");
            }
            if (String.IsNullOrWhiteSpace(newItem.StorageID))
            {
                throw new Exception("StorageID cannot be empty.");
            }
            foreach (var character in Path.GetInvalidFileNameChars())
            {
                if (newItem.StorageID.Contains(character))
                {
                    throw new Exception("StorageID can only contain characters allowable in file names.");
                }
            }
            DirectoryInfo di;
            lock (FileSystemLock)
            {
                di = Directory.CreateDirectory(FolderPath);
            }
            lock (StorageLock)
            {
                if (Storage.ContainsKey(newItem.StorageID))
                {
                    throw new Exception("Item with same StorageID already exists.");
                }
               
                if (Storage.ContainsKey(newItem.StorageID) || File.Exists(Path.Combine(di.FullName, $"{newItem.StorageID}.json")))
                {
                    throw new Exception("Item with same StorageID already exists.");
                }
                Storage.Add(newItem.StorageID, newItem);
               
            }
            if (PersistenceFilter.Invoke(newItem))
            {
                lock (FileSystemLock)
                {
                    File.WriteAllText(Path.Combine(di.FullName, $"{newItem.StorageID}.json"), JSON.Encode(newItem));
                }
            }
        }

        /// <summary>
        /// Check if item exists in either Storage or disk.
        /// </summary>
        /// <param name="storageID"></param>
        /// <returns></returns>
        public bool Exists(string storageID)
        {
            if (FolderPath == null)
            {
                throw new Exception("FolderPath must have a value.");
            }
            lock (StorageLock)
            {
                var di = Directory.CreateDirectory(FolderPath);
                if (Storage.ContainsKey(storageID))
                {
                    Storage[storageID].LastAccessed = DateTime.Now;
                    return true;
                }
                else
                {
                    if (File.Exists(Path.Combine(di.FullName, $"{storageID}.json")))
                    {
                        return true;
                    }
                    else
                    {
                        return false;
                    }
                }
            }
        }

        /// <summary>
        /// Find an item from Storage or disk.
        /// </summary>
        /// <param name="storageID"></param>
        /// <returns></returns>
        public T Find(string storageID)
        {
            if (FolderPath == null)
            {
                throw new Exception("FolderPath must have a value.");
            }
            lock (StorageLock)
            {
                if (Storage.ContainsKey(storageID))
                {
                    Storage[storageID].LastAccessed = DateTime.Now;
                    return Storage[storageID];
                }
            }
            var di = Directory.CreateDirectory(FolderPath);
            if (File.Exists(Path.Combine(di.FullName, $"{storageID}.json")))
            {
                var success = false;
                while (success == false)
                {
                    try
                    {
                        Storage.Add(storageID, JSON.Decode<T>(File.ReadAllText(Path.Combine(di.FullName, $"{storageID}.json"))));
                        Storage[storageID].LastAccessed = DateTime.Now;
                        success = true;
                    }
                    catch
                    {
                        System.Threading.Thread.Sleep(500);
                    }
                }
                return Storage[storageID];
            }
            else
            {
                return default(T);
            }
        }

        /// <summary>
        /// Find an item from Storage or disk.
        /// </summary>
        /// <param name="predicate"></param>
        /// <returns></returns>
        public T Find(Predicate<T> predicate)
        {
            if (FolderPath == null)
            {
                throw new Exception("FolderPath must have a value.");
            }
            lock (StorageLock)
            {

                if (Storage.Any(x => predicate.Invoke(x.Value)))
                {
                    var match = Storage.FirstOrDefault(x => predicate.Invoke(x.Value));
                    match.Value.LastAccessed = DateTime.Now;
                    return match.Value;
                }
            }
            var di = Directory.CreateDirectory(FolderPath);
            foreach (var file in di.GetFiles())
            {
                var item = JSON.Decode<T>(File.ReadAllText(file.FullName));
                if (predicate.Invoke(item))
                {
                    var success = false;
                    while (success == false)
                    {
                        try
                        {
                            item.LastAccessed = DateTime.Now;
                            Storage.Add(item.StorageID, item);
                            success = true;
                        }
                        catch
                        {
                            System.Threading.Thread.Sleep(500);
                        }
                    }
                    return item;
                }
            }
            return default(T);
        }

        /// <summary>
        /// Find an item from Storage or disk.
        /// </summary>
        /// <param name="predicate"></param>
        /// <returns></returns>
        public List<T> FindAll(Predicate<T> predicate)
        {
            if (FolderPath == null)
            {
                throw new Exception("FolderPath must have a value.");
            }
            var matchList = new List<T>();
            lock (StorageLock)
            {
                matchList.AddRange(Storage.Where(x => predicate.Invoke(x.Value)).Select(x => x.Value));
            }
            var di = Directory.CreateDirectory(FolderPath);
            foreach (var file in di.GetFiles())
            {
                var item = JSON.Decode<T>(File.ReadAllText(file.FullName));
                if (predicate.Invoke(item))
                {
                    var success = false;
                    while (success == false)
                    {
                        try
                        {
                            item.LastAccessed = DateTime.Now;
                            Storage.Add(item.StorageID, item);
                            success = true;
                        }
                        catch
                        {
                            System.Threading.Thread.Sleep(500);
                        }
                    }
                    matchList.Add(item);
                }
            }
            return matchList;
        }

        /// <summary>
        /// WARNING: This will read all files on disk within FolderPath.  Returns all items for this StorageList, both in memory and on disk.
        /// </summary>
        /// <returns></returns>
        public List<T> GetAll()
        {
            if (FolderPath == null)
            {
                throw new Exception("FolderPath must have a value.");
            }
            var result = new List<T>();
            var di = Directory.CreateDirectory(FolderPath);
            foreach (var file in di.GetFiles())
            {
                var success = false;
                while (success == false)
                {
                    try
                    {
                        result.Add(JSON.Decode<T>(File.ReadAllText(file.FullName)));
                        success = true;
                    }
                    catch
                    {
                        System.Threading.Thread.Sleep(500);
                    }
                }
            }
            lock (StorageLock)
            {
                foreach (var item in Storage)
                {
                    if (!result.Exists(id => id.StorageID == item.Value.StorageID))
                    {
                        result.Add(item.Value);
                    }
                }
            }
            return result;
        }

        /// <summary>
        /// Remove item from Storage and delete it from disk.
        /// </summary>
        /// <param name="storageID"></param>
        public void Remove(string storageID)
        {
            if (FolderPath == null)
            {
                throw new Exception("FolderPath must have a value.");
            }
            lock (StorageLock)
            {
                if (Storage.ContainsKey(storageID))
                {
                    Storage.Remove(storageID);
                }
                var di = Directory.CreateDirectory(FolderPath);
                if (File.Exists(Path.Combine(di.FullName, $"{storageID}.json")))
                {
                    File.Delete(Path.Combine(di.FullName, $"{storageID}.json"));
                }
            }

        }

        /// <summary>
        /// Save item to disk and clear from Storage.
        /// </summary>
        /// <param name="storageID"></param>
        public void Store(string storageID)
        {
            // Lock is called prior to calling Store.
            if (Storage.ContainsKey(storageID))
            {
                if (PersistenceFilter.Invoke(Storage[storageID]))
                {
                    var di = Directory.CreateDirectory(FolderPath);
                    var success = false;
                    var startTime = DateTime.Now;
                    while (success == false && DateTime.Now - startTime < TimeSpan.FromSeconds(5))
                    {
                        try
                        {
                            lock (FileSystemLock)
                            {
                                File.WriteAllText(Path.Combine(di.FullName, $"{Storage[storageID].StorageID}.json"), JSON.Encode(Storage[storageID]));
                            }
                            success = true;
                        }
                        catch
                        {
                            System.Threading.Thread.Sleep(500);
                        }
                    }
                    if (success)
                    {
                        Storage.Remove(storageID);
                    }
                    else
                    {
                        PersistErrorAction.Invoke();
                    }
                }
            }

        }

        /// <summary>
        /// Store all items in Storage, provided they pass the persistence filter.
        /// </summary>
        public void StoreAll()
        {
            lock (StorageLock)
            {
                for (var i = Storage.Count - 1; i >= 0; i--)
                {
                    Store(Storage.Keys[i]);
                }
            }
        }

        /// <summary>
        /// Persists items in Storage every interval.
        /// </summary>
        /// <param name="sender"></param>
        /// <param name="e"></param>
        private void SaveTimer_Elapsed(object sender, ElapsedEventArgs e)
        {
            SortedList<string, T> tempList;
            lock (StorageLock)
            {
                tempList = new SortedList<string, T>(Storage);
            }
            for (var i = tempList.Count - 1; i >= 0; i--)
            {
                var item = tempList.Values[i];
                if (PersistenceFilter.Invoke(item))
                {
                    if (DateTime.Now - item.LastAccessed >= MemCacheTime)
                    {
                        Store(item.StorageID);
                    }
                    else
                    {
                        var di = Directory.CreateDirectory(FolderPath);
                        var success = false;
                        var startTime = DateTime.Now;
                        while (success == false && DateTime.Now - startTime < TimeSpan.FromSeconds(5))
                        {
                            try
                            {
                                File.WriteAllText(Path.Combine(di.FullName, $"{item.StorageID}.json"), JSON.Encode(item));
                                success = true;
                            }
                            catch
                            {
                                System.Threading.Thread.Sleep(500);
                            }
                        }
                        if (!success)
                        {
                            PersistErrorAction.Invoke();
                        }
                    }
                }
            }
            tempList.Clear();

        }
    }
}