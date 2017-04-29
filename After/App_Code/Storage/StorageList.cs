using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Timers;
using System.Web.Helpers;
using System.Web.Script.Serialization;

namespace StorageLists
{
    public class StorageList<T> where T : StorageItem
    {
        public StorageList()
        {
            SaveTimer = new Timer(SaveInterval);
            SaveTimer.Elapsed += SaveTimer_Elapsed;
            SaveTimer.Start();
        }

        private JavaScriptSerializer Serializer { get; } = new JavaScriptSerializer();

        /// <summary>
        /// Items in memory.  This will not return persisted items that haven't been loaded into memory.
        /// </summary>
        public Dictionary<string, T> Storage { get; set; } = new Dictionary<string, T>();

        /// <summary>
        /// Timer that will persist items in Storage every interval.
        /// </summary>
        private Timer SaveTimer { get; set; }

        /// <summary>
        /// Persists items in Storage every interval.
        /// </summary>
        /// <param name="sender"></param>
        /// <param name="e"></param>
        private void SaveTimer_Elapsed(object sender, ElapsedEventArgs e)
        {
            for (var i = Storage.Count - 1; i >= 0; i--)
            {
                var item = Storage.Values.ElementAt(i);
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
                                File.WriteAllText(Path.Combine(di.FullName, $"{item.StorageID}.json"), Serializer.Serialize(item));
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
        }

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
        /// The length of time to hold items in Storage (in memory) before persisting them.
        /// </summary>
        public TimeSpan MemCacheTime { get; set; } = TimeSpan.FromMinutes(3);

        /// <summary>
        /// The folder within which items of type T will be saved.
        /// </summary>
        public string FolderPath { get; set; }

        /// <summary>
        /// If predicate returns true for item, it will be saved to disk.  Otherwise, it will only be retained in memory.
        /// </summary>
        public Predicate<T> PersistenceFilter { get; set; } = new Predicate<T>((temp) => { return true; });

        /// <summary>
        /// An action to perform if there's a failure writing to disk.  By default, everything is retained in memory.
        /// </summary>
        public Action PersistErrorAction { get; set; } = new Action(() => { });

        /// <summary>
        /// Add new item to Storage.
        /// </summary>
        /// <param name="NewItem"></param>
        public void Add(T NewItem)
        {
            if (FolderPath == null)
            {
                throw new Exception("FolderPath must have a value.");
            }
            if (!(NewItem is StorageItem))
            {
                throw new Exception("Item must implement interface StorageItem.");
            }
            if (String.IsNullOrWhiteSpace(NewItem.StorageID))
            {
                throw new Exception("StorageID cannot be empty.");
            }
            foreach (var character in Path.GetInvalidFileNameChars())
            {
                if (NewItem.StorageID.Contains(character))
                {
                    throw new Exception("StorageID can only contain characters allowable in file names.");
                }
            }
            if (Storage.ContainsKey(NewItem.StorageID))
            {
                throw new Exception("Item with same StorageID already exists.");
            }
            var di = Directory.CreateDirectory(FolderPath);
            if (Storage.ContainsKey(NewItem.StorageID) || File.Exists(Path.Combine(di.FullName, $"{NewItem.StorageID}.json")))
            {
                throw new Exception("Item with same StorageID already exists.");
            }
            Storage.Add(NewItem.StorageID, NewItem);
            if (PersistenceFilter.Invoke(NewItem))
            {
                File.WriteAllText(Path.Combine(di.FullName, $"{NewItem.StorageID}.json"), Serializer.Serialize(NewItem));
            }
        }
        /// <summary>
        /// Remove item from Storage and delete it from disk.
        /// </summary>
        /// <param name="StorageID"></param>
        public void Remove(string StorageID)
        {
            if (FolderPath == null)
            {
                throw new Exception("FolderPath must have a value.");
            }
            if (Storage.ContainsKey(StorageID))
            {
                Storage.Remove(StorageID);
            }
            else
            {
                var di = Directory.CreateDirectory(FolderPath);
                if (File.Exists(Path.Combine(di.FullName, $"{StorageID}.json")))
                {
                    File.Delete(Path.Combine(di.FullName, $"{StorageID}.json"));
                }
            }
        }
        /// <summary>
        /// Save item to disk and clear from Storage.
        /// </summary>
        /// <param name="StorageID"></param>
        public void Store(string StorageID)
        {
            if (Storage.ContainsKey(StorageID))
            {
                if (PersistenceFilter.Invoke(Storage[StorageID]))
                {
                    var di = Directory.CreateDirectory(FolderPath);
                    var success = false;
                    var startTime = DateTime.Now;
                    while (success == false && DateTime.Now - startTime < TimeSpan.FromSeconds(5))
                    {
                        try
                        {
                            File.WriteAllText(Path.Combine(di.FullName, $"{Storage[StorageID].StorageID}.json"), Serializer.Serialize(Storage[StorageID]));
                            success = true;
                        }
                        catch
                        {
                            System.Threading.Thread.Sleep(500);
                        }
                    }
                    if (success)
                    {
                        Storage.Remove(StorageID);
                    }
                    else
                    {
                        PersistErrorAction.Invoke();
                    }
                }
            }
        }
        /// <summary>
        /// Check if item exists in either Storage or disk.
        /// </summary>
        /// <param name="StorageID"></param>
        /// <returns></returns>
        public bool Exists(string StorageID)
        {
            if (FolderPath == null)
            {
                throw new Exception("FolderPath must have a value.");
            }
            if (Storage.ContainsKey(StorageID))
            {
                Storage[StorageID].LastAccessed = DateTime.Now;
                return true;
            }
            else
            {
                var di = Directory.CreateDirectory(FolderPath);
                if (File.Exists(Path.Combine(di.FullName, $"{StorageID}.json")))
                {
                    return true;
                }
                else
                {
                    return false;
                }
            }
        }
        /// <summary>
        /// Find an item from Storage or disk.
        /// </summary>
        /// <param name="StorageID"></param>
        /// <returns></returns>
        public T Find(string StorageID)
        {
            if (FolderPath == null)
            {
                throw new Exception("FolderPath must have a value.");
            }
            if (Storage.ContainsKey(StorageID))
            {
                Storage[StorageID].LastAccessed = DateTime.Now;
                return Storage[StorageID];
            }
            else
            {
                var di = Directory.CreateDirectory(FolderPath);
                if (File.Exists(Path.Combine(di.FullName, $"{StorageID}.json")))
                {
                    var success = false;
                    while (success == false)
                    {
                        try
                        {
                            Storage.Add(StorageID, Serializer.Deserialize<T>(File.ReadAllText(Path.Combine(di.FullName, $"{StorageID}.json"))));
                            Storage[StorageID].LastAccessed = DateTime.Now;
                            success = true;
                        }
                        catch
                        {
                            System.Threading.Thread.Sleep(500);
                        }
                    }
                    return Storage[StorageID];
                }
                else
                {
                    return default(T);
                }
            }
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
                        result.Add(Serializer.Deserialize<T>(File.ReadAllText(file.FullName)));
                        success = true;
                    }
                    catch
                    {
                        System.Threading.Thread.Sleep(500);
                    }
                }
            }
            foreach (var item in Storage)
            {
                if (!result.Exists(id=>id.StorageID == item.Value.StorageID))
                {
                    result.Add(item.Value);
                }
            }
            return result;
        }
    }
}