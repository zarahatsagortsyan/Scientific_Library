using AutoMapper;
using ScientificLibraryBack.DTO;
using ScientificLibraryBack.Models.DB;

namespace ScientificLibraryBack.Mapping
{
    public class MappingProfile: Profile
    {
        public MappingProfile()
        {
            CreateMap<Book, BookDTO>();
            // Add other mappings here
        }
    }

}
