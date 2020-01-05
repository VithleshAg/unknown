new FroalaEditor("textarea#content");

$(document).ready(function() {
  $("#spinner").addClass("spinner-border");
  $("#load").html("<h4>Loading Categories ..</h4>");
  $.getJSON("/category/all_rest", function(data) {
    $("#spinner").removeClass("spinner-border");
    $("#load").html("");
    $("#categories").empty();
    $("#categories").append(
      $("<option disabled selected >").text("Select Category")
    );
    $.each(data, function(index, item) {
      $("#categories").append(
        $("<option>")
          .text(item.catname)
          .val(item._catid)
      );
    });
  });
});
