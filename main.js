// The guestbook example for akshell

// The setup of the basic Akshell library
require('ak').setup();


// The main object we're storing in the DB
init = function () {
  rv.Entry.create(
    {
      id: 'unique serial',
      author: 'string',
      title: 'string',
      message: 'string'
    });
};


// The index page handler (just show all entries)
var IndexHandler = Handler.subclass(
  {
    
    //http GET to list the entries
    get: function (request) {
      allEntries = rv.Entry.all().get({by: '-id'});
      return render(
        'index.html',
        {
          header: 'Hello World!',
          entries: allEntries
        });
    },
    
    //http POST to create an Entry
    post: function (request) {
      if (!request.post.author ||
          !request.post.title ||
          !request.post.message) { throw Failure('All fields are required');}
          
      rv.Entry.insert(
        {
          author: request.post.author,
          title: request.post.title,
          message: request.post.message
        });
      return redirect('/'); //this way they'll see the entries they created
    }    
  });
  
//for querying one Entry
var EntryHandler = Handler.subclass(
{
  get: function (request, id) {
    return render(
      'entry.html', {entry: rv.Entry.where({id: id}).getOne()});
  }
});

// The URL -> handler mapping
// request for index goes to IndexHandler
// request for /123 queries that particular Entry by id
exports.root = new URLMap(
  IndexHandler, 'index',
  [/\d+/, EntryHandler, 'entry']);
