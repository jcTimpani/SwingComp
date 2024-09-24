using Microsoft.AspNetCore.Mvc.RazorPages;

namespace DrumSetCoordination.Pages
{
    public class IndexModel : PageModel
    {
        public string OstinatoType { get; set; } = "basic"; // Default value

        public void OnPost()
        {
            
        }
    }
}
