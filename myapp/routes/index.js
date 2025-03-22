app.get('/', (req, res) => {
  if(req.session.user) {
       res.send(`Hallo ${req.session.user.username}, willkommen im geschützten Bereich. <a href="/logout">Logout</a>`);
  } else {
       res.redirect('/login');
  }
});