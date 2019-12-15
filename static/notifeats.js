$(() => {
  $('.notif-form').submit(function (e) {
    const data = {
      url: $('#url').val(),
      maxDate: Date.now() + ($('#maxDate').val() * 60000)
    }
    fetch('/notify', {
      method: 'POST',
      headers: new Headers({ 'Content-Type': 'application/json' }),
      body: JSON.stringify(data)
    })
      .then(r => r.json())
      .then(result => {
        console.log(result)
      })
      .catch(error => console.error(error))
    return false
  })
})