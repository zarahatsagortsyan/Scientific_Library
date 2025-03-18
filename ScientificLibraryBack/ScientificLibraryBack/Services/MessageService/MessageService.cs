using Microsoft.EntityFrameworkCore;
using ScientificLibraryBack.Contextes;
using ScientificLibraryBack.DTO;
using ScientificLibraryBack.Models.DB;

namespace ScientificLibraryBack.Services.MessageService
{
    public interface IMessageService
    {
        Task<ApiResponse<string>> SaveMessageAsync(string email, string content);
    }

    public class MessageService :IMessageService
    {
        private readonly ApplicationDbContext _context;
        public MessageService(ApplicationDbContext context)
        {
            _context = context;
        }
        public async Task<ApiResponse<string>> SaveMessageAsync(string email, string content)
        {
            if (string.IsNullOrEmpty(email) || string.IsNullOrEmpty(content))
            {
                return new ApiResponse<string> { Success = false, Message = "Email and content are required" };
            }

            var message = new Message { Email = email, Content = content };
            _context.Messages.Add(message);
            await _context.SaveChangesAsync();

            return new ApiResponse<string> { Success = true, Message = "Message saved successfully" };
        }
    }
}
