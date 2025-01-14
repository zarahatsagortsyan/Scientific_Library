using System.ComponentModel.DataAnnotations;

namespace ScientificLibraryBack.Models
{
    public class ResetPasswordRequest
    {

        [Required(ErrorMessage ="Password is required")]
        public string? NewPassword { get; set; }  // The new password the user wants to set

        [Compare("NewPassword", ErrorMessage = "The password and confirmation password do not match.")]
        public string? ConfirmNewPassword { get; set; }  // The new password the user wants to set

        public string? Email { get; set; }  // The username or email of the user
        public string? Token { get; set; }  // The reset token sent to the user
    }
}
