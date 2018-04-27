using After.Dependencies;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

namespace After
{
    public static class Utilities
    {
        public static void WriteError(Exception Ex)
        {
            var filePath = Path.Combine(App.DataPath, "Errors", DateTime.Now.Year.ToString(), DateTime.Now.Month.ToString().PadLeft(2, '0'), DateTime.Now.Day.ToString().PadLeft(2, '0') + ".txt");
            if (!Directory.Exists(Path.GetDirectoryName(filePath)))
            {
                Directory.CreateDirectory(Path.GetDirectoryName(filePath));
            }
            var exError = Ex;
            while (exError != null)
            {
                var jsonError = new
                {
                    Timestamp = DateTime.Now.ToString(),
                    Message = exError?.Message,
                    InnerEx = exError?.InnerException?.Message,
                    Source = exError?.Source,
                    StackTrace = exError?.StackTrace,
                };
                var error = JSON.Encode(jsonError) + Environment.NewLine;
                File.AppendAllText(filePath, error);
                exError = exError.InnerException;
            }
        }
        public static void WriteLog(string Category, string Message)
        {
            var filePath = Path.Combine(App.DataPath, "Logs", DateTime.Now.Year.ToString(), DateTime.Now.Month.ToString().PadLeft(2, '0'), DateTime.Now.Day.ToString().PadLeft(2, '0') + ".txt");
            if (!Directory.Exists(Path.GetDirectoryName(filePath)))
            {
                Directory.CreateDirectory(Path.GetDirectoryName(filePath));
            }
            File.AppendAllText(filePath, $"{Category.ToUpper()} - {DateTime.Now.ToString()} - {Message}");
        }
    }
}
