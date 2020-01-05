function showEditPost(data) {
  let html = ` 
  <div class="row" style = 'padding-top : 5%'>
   <div class="col" >
    <button class = 'btn btn-primary' id = 'back' >Go Back </button>

    </div>
  </div>
  <div class="row" style="  padding-top : 5%" >
    <div class="col">
      <div class="container">
        <div class="card mt-3">
          <div class="card-header">
            <b>Create Post </b>
          </div>
          <form id="myform" action="/posts/submit" method="post">
            <div class="card-body register">
              <div class="form-group">
                <div class="text-primary" id="spinner" role="status">
                  <span class="sr-only">Loading...</span>
                </div>
                <div id="load"></div>

                <select
                  class="custom-select"
                  name="categories"
                  multiple
                  id="categories"
                >
                  <option disabled selected>Select Category</option>
                </select>
              </div>
              <div class="form-group">
                <label for="formGroupExampleInput">Title</label>

                <input
                  type="text"
                  class="form-control"
                  name="title"
                  id=""
                  value = '${data.title}'
                  required
                />
              </div>
              <div class="form-group">
                <textarea
                  id="content"
                  name="content"
                  
                  placeholder="Write Your Post Here .. "
                >${data.content}</textarea>
              </div>
              <div class="form-group">
                <input
                  value="Create Post"
                  type="submit"
                  style="width : 100%"
                  class="btn btn-primary"
                />
              </div>
            </div>
          </form>
        </div>
      </div>
   </div>
  </div>`;
  $("#mydiv").html(html);
  new FroalaEditor("textarea#content");
}

function loadPosts() {
  $("#mydiv").html("");
  $("#spinner").addClass("spinner-border");
  $.getJSON("/posts/all_rest", function(data) {
    $("#spinner").removeClass("spinner-border");
    let html = ``;
    data.forEach(function(row) {
      html += `<div class="row " style="  padding-top : 5%">`;
      row.forEach(function(col) {
        html += ` 
        <div class="col" style="width: 130%;">
            <div class="card">
                <div class="card-header">
                <h4> ${col.title}</h4>
                </div>
                <div class="card-body">
                ${col.content}
                <button class="btn btn-primary edit" post_id  = '${col._id}'>Edit Post</Button>
                <button class="btn btn-danger delete" post_id = '${col._id}' >Delete this post </button>
                </div>
                <div class="card-footer text-muted">
                ${col.date}
                </div>
            </div>
        </div>`;
        if (row.length === 1) {
          html += `<div class="col" style="width: 130%;"></div>`;
        }
      });

      html += `</div>`;
    });

    $("#mydiv").html(html);
  });
}

$("#mydiv").on("click", "#back", function() {
  loadPosts();
});

$("#mydiv").on("click", ".delete", function() {
  let post_id = $(this).attr("post_id");
  $(this).attr("disabled", "true");
  $(this).html("Deleting....");
  $.post("/posts/delete", { post_id: post_id }, function(data) {
    if (data.message === "deleted") {
      loadPosts();
    }
  });
});

$("#mydiv").on("click", ".edit", function() {
  let post_id = $(this).attr("post_id");
  $(this).attr("disabled", "true");
  $(this).html("Loading Post ....");
  $.getJSON(`/posts/getById/${post_id}`, function(data) {
    console.log(data.post);
    showEditPost(data.post);
  });
});

$(document).ready(() => {
  loadPosts();
});

/// making async nature of js to sync nature

// let data = await $.getJSON(`/posts/getById/${post_id}`);
// sum = a + b + parseInt(data.data.num);
// console.log(sum);
