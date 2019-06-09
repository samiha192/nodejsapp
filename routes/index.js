
module.exports = function (app, db)
{
    var ObjectID = require('mongodb').ObjectID;
    
    /* GET SPA pure  html, our jQuery Mobile app */
    app.get('/', function (req, res) {
        res.sendFile('mySPA.html', { root: __dirname });
    });

    app.get('/notelist', async function (req, res) {
        // app.get('/productlist', function (req, res) {
        try {
            var doc = await db.collection('CarCollection').find().toArray();
            res.send(doc);
        }
        catch (err) {
            console.log('get all failed');
            console.error(err);
        }
    });


    function compare(a, b) {
        if (a.Make < b.Make) {
            return -1;
        }
        if (a.Make > b.Make) {
            return 1;
        }
        return 0;
    }



    // /* GET New Note page. */  Do not need to ask server for new form page, our SPA has it!
    // app.get('/newnote', function (req, res) {
    //   res.render('newnoteJade', { title: 'Add New Note' });
    // });

    //Add note
    app.post('/addNote/', function (req, res)
    {
        db.collection('CarCollection').insertOne(req.body, (err, result) =>
        {
            if (err) {
                res.send({ 'error': 'An error has occurred' });
            } else {
                res.redirect({ 'success': 'CarInserted' });
            }
        });
    });

    // // form to let user enter name to get details   Do not need to ask server for new form page, our SPA has it!
    // app.get('/notebysubject/', function (req, res) {
    //   res.render('notebysubjectJade', { title: 'Get more details, by Subject' });
    // });

    //Find Note
    app.get('/findnote/:id', (req, res) => {    // was app.post)

        const details = req.params.id;
        db.collection('CarCollection').findOne({ make: details }, (err, item) => {
            if (err) {
                console.log('error');
                res.send({ 'error': 'An error has occurred :(' });
            } else {
                if (item == null) {
                    item = { Year: "", Make: "no such car", Model: "" }
                }
                res.send(item);
            }
        });
    });


    //Delete
    app.delete('/deleteNote/:id', (req, res) => {
        const who = req.params.id;  // delete by Subject
        console.log(who + ' to delete');
        const which = { 'make': who };
        db.collection('CarCollection').deleteOne(which, (err, item) => {
            if (err) {
                res.send({ 'error': 'An error has occurred :(' });
            } else {
                res.send('Car ' + who + ' deleted!');
            }
        });
    });

    //app.put('/updateNote/:id', (req, res) => {
    //    const subject = req.params.id;
    //    const note = req.body;
    //    const newPriority = note.priority;
    //    const newSubject = note.notesubject;
    //    const newDescription = note.description;
    //    //const newSubject = note.Subject;

    //    //const details = { '_id': new ObjectID(who_id) };  // not going to try and update by _id
    //    // wierd bson datatype add complications

    //    // if uddating more than one field: 
    //    //db.collection('UserCollection').updateOne({ username: who_id }, { $set: { "email": newEmail, "title": newTitle } }, (err, result) => {

    //    // updating priority and/or description, not subject
    //    db.collection('NotesCollection').updateOne({ notesubject: subject }, { $set: { "priority": newPriority, "notesubject": newSubject, "description": newDescription } }, (err, result) => {
    //        if (err) {
    //            res.send({ 'error': 'An error has occurred' });
    //        } else {
    //            res.send(note);
    //        }
    //    });
    //});

    //UpdateNote
    app.put('/updateNote/:id', function (req, res) {
        const data = req.body;
        db.collection('CarCollection').update({ make: data(req.params.id) }, { $set: data }, function (err, result) {
            if (err) {
                console.log(err);
            }
            res.send('updated successfully');
        });
    });

};  // end of mod exports