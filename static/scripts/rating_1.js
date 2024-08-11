  <d class="stars" v-bind:class="{ 'rating-selected': ratingSelected }">
    <input type="radio" name="rating" id="rating_5" v-on:change="changeRating(5)"/>
    <label for="rating_5">
      <svg viewBox="0 0 24 24">
        <path d="M12,17.27L18.18,21L16.54,13.97L22,9.24L14.81,8.62L12,2L9.19,8.62L2,9.24L7.45,13.97L5.82,21L12,17.27Z"></path>
      </svg>
    </label>
    <input type="radio" name="rating" id="rating_4" v-on:change="changeRating(4)"/>
    <label for="rating_4">
      <svg viewBox="0 0 24 24">
        <path d="M12,17.27L18.18,21L16.54,13.97L22,9.24L14.81,8.62L12,2L9.19,8.62L2,9.24L7.45,13.97L5.82,21L12,17.27Z"></path>
      </svg>
    </label>
    <input type="radio" name="rating" id="rating_3" v-on:change="changeRating(3)"/>
    <label for="rating_3">
      <svg viewBox="0 0 24 24">
        <path d="M12,17.27L18.18,21L16.54,13.97L22,9.24L14.81,8.62L12,2L9.19,8.62L2,9.24L7.45,13.97L5.82,21L12,17.27Z"></path>
      </svg>
    </label>
    <input type="radio" name="rating" id="rating_2" v-on:change="changeRating(2)"/>
    <label for="rating_2">
      <svg viewBox="0 0 24 24">
        <path d="M12,17.27L18.18,21L16.54,13.97L22,9.24L14.81,8.62L12,2L9.19,8.62L2,9.24L7.45,13.97L5.82,21L12,17.27Z"></path>
      </svg>
    </label>
    <input type="radio" name="rating" id="rating_1" v-on:change="changeRating(1)"/>
    <label for="rating_1">
      <svg viewBox="0 0 24 24">
        <path d="M12,17.27L18.18,21L16.54,13.97L22,9.24L14.81,8.62L12,2L9.19,8.62L2,9.24L7.45,13.97L5.82,21L12,17.27Z"></path>
      </svg>
    </label>
    <div class="rating-comment">
      <h3 v-if="ratingTitle != ''">{{ ratingTitle }}</h3>
      <p v-if="ratingMessage != ''">{{ ratingMessage }}</p>
      <h2>{{ rating }} {{ starText }}</h2>
    </div>
  </d>
