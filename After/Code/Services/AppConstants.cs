using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Logging.Console;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace After.Code.Services
{
    public class AppConstants
    {
        public static double RendererWidth => 1280;
        public static double RendererHeight => 720;

        private static LoggerFactory customLogger;
        public static LoggerFactory CustomLogger
        {
            get
            {
                if (customLogger == null)
                {
                    customLogger = new LoggerFactory(new[] {
                        new ConsoleLoggerProvider(new ConsoleLoggerSettings())},
                        new LoggerFilterOptions()
                        {
                                MinLevel = LogLevel.Warning
                        });
                }
                return customLogger;
            }
        }

    }
}
