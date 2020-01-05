function LoadData() {
  $("#mycontainer").html("<h1>Loading .....  </h1>");
  /// FETCH API VANILLA JS /////
  // fetch(`/writer/all_rest`)
  //   .then(res => res.json())
  //   .then(data => console.log("FETCH API : ", data))
  //   .catch(err => console.log(err));
  ////////////////////////////
  $.getJSON(`/writer/all_rest`, function(data) {
    console.log(data);
    let table = `<table border = 'true'>`;
    table += `<tr>`;
    table += `<th>Name</th>`;
    table += `<th>Email</th>`;
    table += `</tr>`;
    for (let i = 0; i < data.length; i++) {
      table += `<tr>`;
      table += `<td>${data[i].name}</td><td>${data[i].email}</td>`;
      table += `</tr>`;
    }
    table += `</table>`;
    $("#mycontainer").html(table);
  });
}

$("#my").click(function() {
  LoadData();
  localStorage.setItem("token", "#@123");
});
