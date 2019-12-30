/**
 * Web application
 */
const apiUrl = 'https://6f374697.eu-gb.apigw.appdomain.cloud/features';
const guestbook = {
  // retrieve the existing guestbook entries
  get(csIdSearched) {
    return $.ajax({
      type: 'GET',
      url: `${apiUrl}/features`,
      data: { 
        csId: csIdSearched
      },
      dataType: 'json'
    });
  },
  // add a single guestbood entry
  add(csId, featureId, featureEnabled) {
    console.log('Sending', csId, featureId, featureEnabled)
    return $.ajax({
      type: 'PUT',
      url: `${apiUrl}/features`,
      contentType: 'application/json; charset=utf-8',
      data: JSON.stringify({
        csId,
        featureId,
        featureEnabled,
      }),
      dataType: 'json',
    });
  }
};

(function() {

  let entriesTemplate;

  function prepareTemplates() {
    entriesTemplate = Handlebars.compile($('#entries-template').html());
  }

  // retrieve entries and update the UI
  function loadEntries(csIdSearched) {
    console.log('Loading entries...');
    $('#entries').html('Loading entries...');
    guestbook.get(csIdSearched).done(function(result) {
      if (!result.entries) {
        return;
      }

      const context = {
        entries: result.entries
      }
      $('#entries').html(entriesTemplate(context));
    }).error(function(error) {
      $('#entries').html('No entries');
      console.log(error);
    });
  }

  // intercept the click on the submit button, add the guestbook entry and
  // reload entries on success
  $(document).on('submit', '#addEntry', function(e) {
    e.preventDefault();

    guestbook.add(
      $('#csId').val().trim(),
      $('#featureId').val().trim(),
      $('#featureEnabled').val().trim()
    ).done(function(result) {
      // reload entries
      loadEntries($('#csId').val().trim());
    }).error(function(error) {
      console.log(error);
    });
  });

  $(document).ready(function() {
    prepareTemplates();
    //loadEntries();
    $('#searchButton').click(function() {
      var csIdSearched = $('#csIdSearch').val().trim();
      loadEntries(csIdSearched);
    });
  });
})();
