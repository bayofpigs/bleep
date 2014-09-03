$(document).ready(function() {
  $('#save').click(function(e) {

    e.preventDefault();
    var id = $(this).attr("value");

    $.ajax({
      url: "/admin/edit/" + id,
      type: "PUT",
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

        alert("Failed to edit post: " + err + ". Try again later.");
      }
    })

  });
});