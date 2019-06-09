
$(document).on('pagebeforeshow ', '#home', function () {   // see: https://stackoverflow.com/questions/14468659/jquery-mobile-document-ready-vs-page-events
    var info_view = "";      //string to put HTML in
    $('#notes').empty();  // since I do this everytime the page is redone, I need to remove existing before apending them all again
    $.getJSON('/notelist/')   //Send an AJAX request
        .done(function (data) {
            console.log("json received");
            $.each(data, function (index, record) {   // make up each li as an <a> to the details-page
                $('#notes').append('<li><a data-parm=' + record.make + ' href="#details-page">' + record.make + '</a></li>');
            });

            $("#notes").listview('refresh');  // need this so jquery mobile will apply the styling to the newly added li's

            $("a").on("click", function (event) {    // set up an event, if user clicks any, it writes that items data-parm into the details page's html so I can get it there
                var parm = $(this).attr("data-parm");
                //do something here with parameter on  details page
                $("#detailParmHere").html(parm);

            });

        }); // end of .done

});




$(document).on('pagebeforeshow', '#details-page', function () {

    var textString = 'fix me';
    var id = $('#detailParmHere').text();
    $.getJSON('/findnote/' + id)
        .done(function (data) {
            textString = "Year: " + data.year;
            textString1 = "Make: " + data.make;
            textString2 = "Model: " + data.model;
            $('#showdata').text(textString);
            $('#showdata1').text(textString1);
            $('#showdata2').text(textString2);
        })
        .fail(function (jqXHR, textStatus, err) {
            textString = "could not find";
            $('#showdata').text(textString);
        });



});



$(document).on('pagebeforeshow', '#deletepage', function () {

    $('#noteToDelete').val('');
});

function deleteNote() {
    const subject = document.getElementById('noteToDelete').value;
    document.getElementById('noteToDelete').value = "";
    $.ajax({
        method: "DELETE",
        url: "/deletenote/" + subject,
        success: function (result) {
            console.log(result);
            window.location.href = '#home';
        }
    });
}

// clears the fields
$(document).on('pagebeforeshow', '#addpage', function () {
    $('#newPriority').val('');
    $('#newSubject').val('');
    $('#newDescription').val('');
});


function addNote() {
    const Priority = $('#newPriority').val();
    const Notesubject = $('#newSubject').val();
    const Description = $('#newDescription').val();
    const newNote = { year: Priority, make: Notesubject, model: Description };

    $.ajax({
        url: '/addnote/',
        type: "POST",
        dataType: "json",
        contentType: 'application/json',
        data: JSON.stringify(newNote),
        success: function (result) {
            console.log(result);
            window.location.href = '#home';
        }

    });

}


$(document).on('pagebeforeshow', '#updatepage', function () {
    $('#newPriority').val('');
    $('#newSubject').val('');
    $('#newDescription').val('');
});
function updateNote() {
    var oldsubject = $('detailParmHere').innerHTML;
    const Priority = $('#newPriority').val();
    const Notesubject = $('#newSubject').val();
    const Description = $('#newDescription').val();

    // sending all 3 values in json object, even though only using subject
    const dataObject = { year: Priority, make: Notesubject, model: Description};

    $.ajax({
        url: '/updatenote/' + oldsubject,  // putting the note subject in the URL for the PUT method
        method: 'PUT',
        dataType: 'json',
        contentType: 'application/json',
        data: JSON.stringify(dataObject),
        success: function (result) {
            alert("success");
            window.location.href = '#home';
        }
    });
}






