using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace After.Data
{
    public class DataService
    {
        private ApplicationDbContext DBContext { get; set; }
        public DataService(ApplicationDbContext dbContext)
        {
            DBContext = dbContext;
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
            return DBContext.Users.Include(x=>x.Characters).FirstOrDefault(x=>x.UserName == userName)
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

        public void DeleteAllCharacters(string id)
        {
            var user = DBContext.Users.Include(x => x.Characters).FirstOrDefault(x => x.Id == id);
            user?.Characters.ForEach(x =>
            {
                DBContext.PlayerCharacters.Remove(x);
            });
            DBContext.SaveChanges();
        }
    }
}
