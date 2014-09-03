$(document).ready(function() {
  $('#save').click(function(e) {

    e.preventDefault();

    $.ajax({
      url: "/admin/create",
      type: "POST",
      dataType: "json",
      data: {
        title: $('#title').val(),
        content: $('#editor').html()
      },
      success: function(response) {
        window.location = "/admin";
      },
      error: function(jq, status, err) {
        if (err == "Forbidden") {
          window.location = "/admin/login";
          return;
        }

        alert("Failed to create post: " + err + ". Try again later.");
      }
    })

  });
});