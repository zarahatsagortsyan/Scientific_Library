using ScientificLibraryBack.Services.EmailService.Models;

namespace ScientificLibraryBack.Services.EmailService
{
    public interface IEmailService
    {
        void SendEmail(Message message);
    }
}
