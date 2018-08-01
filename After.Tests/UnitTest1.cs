using After.Code.Models;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using System.Collections.Generic;
using System.Drawing;
using System;

namespace After.Tests
{
    [TestClass]
    public class UnitTest1
    {
        public UnitTest1()
        {
            for (var i = 0; i < 1000000; i++)
            {
                GameObjects.Add(new GameObject()
                {
                    ID = Guid.NewGuid()
                });
            }
            Assert.IsTrue(true);
        }
        public List<GameObject> GameObjects { get; set; } = new List<GameObject>();


        [TestMethod]
        public void UnitTest()
        {
            GameObjects.ForEach(x => x.ModifiedThisGameLoop = true);
            GameObjects.ForEach(x => x.ModifiedThisGameLoop = false);
        }
        [TestMethod]
        public void UnitTest2()
        {
            for (var i = 0; i < GameObjects.Count; i++)
            {
                GameObjects[i].ModifiedThisGameLoop = true;
            }
            for (var i = 0; i < GameObjects.Count; i++)
            {
                GameObjects[i].ModifiedThisGameLoop = false;
            }
            Assert.IsTrue(true);
        }
    }
}
