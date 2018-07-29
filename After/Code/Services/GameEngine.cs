using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Timers;

namespace After.Code.Services
{
    public class GameEngine
    {
        public GameEngine(DataService dataService)
        {
            DataService = dataService;
        }

        public void Init()
        {
            LastTick = DateTime.Now;
            MainLoop = Task.Run(new Action(RunMainLoop));
        }


        public DataService DataService { get; set; }
        private Task MainLoop { get; set; }
        private void RunMainLoop()
        {
            var delta = DateTime.Now - LastTick;
            if (delta < TimeSpan.FromMilliseconds(50))
            {
                System.Threading.Thread.Sleep(10);
                RunMainLoop();
                return;
            }
            LastTick = DateTime.Now;


            UpdateSceneList();

            UpdateInputValues();

            UpdateVelocitiesFromAppliedForce();

            UpdatePositionsFromVelociy();

            AddAndRemoveSceneObjectsInEachScene();

            ApplyStatusEffects();

            System.Threading.Thread.Sleep(10);
            RunMainLoop();
        }

        private void ApplyStatusEffects()
        {
            
        }

        private void AddAndRemoveSceneObjectsInEachScene()
        {
            
        }

        private void UpdatePositionsFromVelociy()
        {
            
        }

        private void UpdateVelocitiesFromAppliedForce()
        {
            
        }

        private void UpdateInputValues()
        {
            
        }

        private void UpdateSceneList()
        {
            
        }

        private DateTime LastTick { get; set; }
        private ApplicationDbContext DBContext { get; set; }
    }
}
