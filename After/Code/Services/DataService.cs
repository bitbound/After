using After.Code.Models;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace After.Code.Services
{
    public class DataService
    {
        private ApplicationDbContext DBContext { get; set; }
        private GameEngine GameEngine { get; set; }
        public DataService(ApplicationDbContext dbContext, GameEngine gameEngine)
        {
            DBContext = dbContext;
            GameEngine = gameEngine;
        }

        public bool IsCharacterNameTaken(string name)
        {
            return DBContext.Users.Include(x => x.Characters).Any(x => x.Characters.Any(y => y.Name == name));
        }

        public void AddNewCharacter(string userName, PlayerCharacter newCharacter)
        {
            DBContext.Users.FirstOrDefault(x => x.UserName == userName)?.Characters?.Add(newCharacter);
            DBContext.SaveChanges();
        }

        public PlayerCharacter GetCharacter(string userName, string characterName)
        {
            return DBContext.Users.AsNoTracking()
                .Include(x=>x.Characters)
                .FirstOrDefault(x=>x.UserName == userName)
                ?.Characters?.FirstOrDefault(x => x.Name == characterName);
        }

        public void DeleteCharacter(string characterName)
        {
            var removeCharacter = DBContext.PlayerCharacters.FirstOrDefault(x => x.Name == characterName);
            DBContext.PlayerCharacters.Remove(removeCharacter);
            DBContext.SaveChanges();
        }

        public AfterUser GetUser(string name)
        {
            return DBContext.Users.FirstOrDefault(x => x.UserName == name);
        }

        public List<PlayerCharacter> GetPlayerCharacters(string userName)
        {
            
            return DBContext.Users.Include(x => x.Characters)
                .FirstOrDefault(x => x.UserName == userName)?.Characters.ToList();
        }

        public void DeleteAllCharacters(string userName)
        {
            var user = DBContext.Users.Include(x => x.Characters).FirstOrDefault(x => x.UserName == userName);
            user?.Characters.ForEach(x =>
            {
                DBContext.PlayerCharacters.Remove(x);
            });
            DBContext.SaveChanges();
        }

       
       

        public void AddError(Error error)
        {
            DBContext.Errors.Add(error);
            DBContext.SaveChanges();
        }

        internal void DeleteUser(string userName)
        {
            DeleteAllCharacters(userName);
            var user = DBContext.Users.FirstOrDefault(x => x.UserName == userName);
            DBContext.Users.Remove(user);
            DBContext.SaveChanges();
        }

        public void CleanupTempUsers()
        {
            DBContext.Users
                .Where(x => x.IsTemporary && x.LastLogin < DateTime.Now.AddDays(-14))
                .ToList()
                .ForEach(x => DeleteUser(x.UserName));
            DBContext.SaveChanges();
        }

        internal void SetLastLogin(string userName, DateTime loginDate)
        {
            var user = DBContext.Users.FirstOrDefault(x => x.UserName == userName).LastLogin = loginDate;
            DBContext.SaveChanges();
        }

    }
}
