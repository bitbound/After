using After.Code.Models;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using System.Drawing;

namespace After.Tests
{
    [TestClass]
    public class UnitTest1
    {
        [TestMethod]
        public void LocationTest()
        {
            var x = 0;
            var y = 0;
            var width = 0;
            var height = 0;
            Rectangle location;

            for (var i = 0; i < 10000000; i++)
            {
                x = i;
                y = i;
                width = i;
                height = i;
                location = new Rectangle(x, y, width, height);
            }

            Assert.IsTrue(true);
        }
        [TestMethod]
        public void LocationTest2()
        {
            var x = 0;
            var y = 0;
            var width = 0;
            var height = 0;
            Rectangle location = new Rectangle(x, y, width, height);

            for (var i = 0; i < 10000000; i++)
            {
                x = i;
                y = i;
                width = i;
                height = i;
                location.X = x;
                location.Y = y;
                location.Width = width;
                location.Height = height;
            }

            Assert.IsTrue(true);
        }
    }
}
