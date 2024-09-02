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
      if (!this.ratingSelected) {
        this.rating = val;
        this.ratingSelected = true;
        this.sendRating();
      }
    },
    sendRating: function() {
      const data = {
        stars: this.rating
      };
      
      fetch('/process', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      })
      .then(response => response.json())
      .then(result => {
        // Assuming the server returns the average rating as a string
        console.log('Success:', result);
        if (result.averageRating) {
          // Update the rating with the average rating received from the server
          this.rating = parseFloat(result.averageRating);
        }
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
