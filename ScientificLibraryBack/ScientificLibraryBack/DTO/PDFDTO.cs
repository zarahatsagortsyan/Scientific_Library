using Microsoft.EntityFrameworkCore.Query.Internal;

namespace ScientificLibraryBack.DTO
{
    public class PDFDTO
    {
        public byte[] pdfFile { get; set; }
        public string pdfFileName { get; set; }

    }
}
