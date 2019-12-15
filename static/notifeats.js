$(() => {
  let timeout
  $('.notif-form').submit(function (e) {
    const minutes = ($('#maxDate').val() > 30 ? 30 : $('#maxDate').val()) * 60000
    const data = {
      url: $('#url').val(),
      maxDate: Date.now() + minutes
    }
    if (timeout) {
      clearTimeout(timeout)
    }
    showLoading()
    showNotif()
    fetch('/notify', {
      method: 'POST',
      headers: new Headers({ 'Content-Type': 'application/json' }),
      body: JSON.stringify(data)
    })
      .then(r => {
        hideLoading()
        console.log(r.status)
        switch (r.status) {
          case 400:
            showBadRequest()
            break
          case 500:
            showError()
            break
          case 200:
            showAlreadyAvailable()
            emptyForm()
            break

          case 201:
            showJobCreated()
            emptyForm()
            break
        }
        timeout = setTimeout(() => hideNotif(), 8000)
      })
      .catch(error => console.error(error))
    return false
  })
})

function emptyForm() {
  $('.notif-form input').val('')
}

function showNotif() {
  $('.notification').addClass('showing')
}

function hideNotif() {
  $('.notification').removeClass('showing')
}

function showLoading() {
  $('.notification .icon div').hide()
  $('.notification .text div').hide()
  $('.notification .loading').show()
}

function hideLoading() {
  $('.notification .loading').hide()
}

function showBadRequest() {
  $('.notification .badrequest').show()
}

function showError() {
  $('.notification .error').show()
}

function showAlreadyAvailable() {
  $('.notification .available').show()
}

function showJobCreated() {
  $('.notification .created').show()
}