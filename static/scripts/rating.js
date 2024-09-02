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
        console.log('Success:', result);
        if (result.averageRating) {
          this.rating = parseFloat(result.averageRating);
          document.getElementById('dynamic_value').textContent = `${this.rating} stars`;
        }
      })
      .catch(error => {
        console.error('Error:', error);
      });
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
