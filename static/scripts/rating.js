Vue.component('starRating', {
  props: ['ratingTitle', 'ratingMessage', 'starText'],
  data: () => {
    return {
      rating: 0,
      ratingSelected: false
    };
  },
  methods: {
    changeRating: function (val) {
      if (this.rating === 0) {
        this.rating = val;
        this.ratingSelected = true;
        this.sendRating();
      }
    },
    sendRating: function() {
      // Create the JSON object with the rating value
      const data = {
        stars: this.rating
      };
      
      // Send the data using fetch API
      fetch('/process', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      })
      .then(response => response.json())
      .then(result => {
        console.log('Success:', result);
      })
      .catch(error => {
        console.error('Error:', error);
      });
    }
  },
  template: '#tpl_star_rating'
});

var app = new Vue({
  el: '#rate',
  data: {
    ratingTitle: 'Thank you!',
    ratingMessage: 'You rated this project:',
    starText: 'star/s'
  }
});
