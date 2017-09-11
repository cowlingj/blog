const React = require("react")

class View extends React.Component {
  render() { return (<html><head><title>a react template</title></head>
      <body>
        <h1 id="header">this is some text</h1>
        <p>{this.props.text}</p>
        <script src="/assets/js/react.js" type="text/javascript"></script>
      </body>
    </html>
  )}
}

module.exports = View
