using Microsoft.AspNetCore.Mvc;
using ScientificLibraryBack.DTO;
using ScientificLibraryBack.Services.MessageService;

namespace ScientificLibraryBack.Controllers
{
    [ApiController]
    [Route("api/messages")]
    public class MessageController : Controller
    {
        private readonly IMessageService _messageService;

        public MessageController(IMessageService messageService)
        {
            _messageService = messageService;
        }

        [HttpPost]
        public async Task<IActionResult> SendMessage([FromBody] MessageRequest request)
        {
            var response = await _messageService.SaveMessageAsync(request.Email, request.Content);
            return Ok(response);
        }
    }
}
