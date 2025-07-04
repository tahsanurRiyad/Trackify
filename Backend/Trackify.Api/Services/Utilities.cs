using System.Data;
using System.Reflection;

namespace Trackify.Api.Services
{
    public class Utilities
    {
        public static DataTable ToDataTable<T>(IList<T> data)
        {
            var table = new DataTable(typeof(T).Name);
            var properties = typeof(T).GetProperties();

            foreach (var prop in properties)
            {
                // Get underlying type for nullable properties
                var propType = Nullable.GetUnderlyingType(prop.PropertyType) ?? prop.PropertyType;
                table.Columns.Add(prop.Name, propType);
            }

            foreach (var item in data)
            {
                var values = new object[properties.Length];
                for (int i = 0; i < properties.Length; i++)
                {
                    var value = properties[i].GetValue(item, null);
                    values[i] = value ?? DBNull.Value;
                }
                table.Rows.Add(values);
            }

            return table;
        }
    }
}
