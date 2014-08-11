(function($) {
  var errorsPresent = false;

  var noError = function() {
    if (!errorsPresent) return true;
    return false;
  };

  var verifySubmit = function() {
    if (noError()) {
      return true;
    }
    return false;
  };

  var checkConfirmPasswordIsTheSame = function() {
    var password = $('#password').val();
    var passwordConfirm = $('#passwordconfirm').val();

    return password === passwordConfirm;
  };

  $('#passwordconfirm, #password').on('keyup', function() {
    console.log("Detected keyup");
    var passwordText = $('#password').val();
    if (!checkConfirmPasswordIsTheSame() || passwordText.length === 0) {
      errorsPresent = true;
      $('#password').parent().addClass('has-error');
      $('#passwordconfirm').parent().addClass('has-error');
      $('#passwordconfirm').next('.errorMessage').show();
    } else {
      errorsPresent = false;
      $('#password').parent().removeClass('has-error');
      $('#password').parent().addClass('has-success');
      $('#passwordconfirm').parent().removeClass('has-error');
      $('#passwordconfirm').parent().addClass('has-success');
      $('#passwordconfirm').next('.errorMessage').hide();
    }
  });

  $(document).ready(function() {
    $('form').on('submit', verifySubmit);
  });
})($);