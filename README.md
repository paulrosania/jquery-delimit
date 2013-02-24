# jquery-delimit

![Sweet Fence](http://www.agfencesolutions.com/wp-content/uploads/2013/01/pageimg1.jpg)

jquery-delimit transforms text boxes into delimited input fields, similar to
Gmail's 'To' field.

## Installation

Include `jquery.delimit.js` and `jquery.delimit.css` in your page. Make sure
jQuery is loaded first!

## Usage

Basic usage (comma-delimited):

    $(...).delimit();

Custom delimiters:

    $(...).delimit({
      delimiters: [',', ' ']
    });

## Contributing

1. Fork it
2. Make your changes
3. Send me a pull request

If you're making a big change, please open an Issue first, so we can discuss.
