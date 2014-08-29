$(document).ready(function() {
  function getIdFromIdAttr(attr) {
    return Number(attr.substring("post".length));
  };

  $('.delete').click(function(e) {
    e.preventDefault();

    if (window.confirm("Are you sure you want to delete this post?")) {
      var parent = $(this).parent();
      var id = getIdFromIdAttr($(this).parent().attr('id'));
      console.log("Chose id " + id);

      $.ajax({
        url: "/admin/post/" + id,
        type: "DELETE",
        dataType: "json",
        success: function(response) {
          parent.hide();
        },
        error: function(jq, status, err) {
          if (err == "Forbidden") {
            window.location = "/admin/login";
            return;
          }

          alert("Failed to delete post: " + err);
        }
      })
    }

  });
});