const handlebars = require("handlebars");

const emailTemplate = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: #4CAF50; color: white; padding: 20px; text-align: center; }
    .content { padding: 30px; background: #f9f9f9; }
    .button { display: inline-block; padding: 10px 20px; background: #4CAF50; 
              color: white; text-decoration: none; border-radius: 4px; }
    .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>{{title}}</h1>
    </div>
    <div class="content">
      <p>Hi {{username}},</p>
      <p>{{description}}</p>
      <p style="text-align: center;">
        <a href="{{link}}" class="button">{{buttonText}}</a>
      </p>
      <p>Or copy this link: <a href="{{link}}">{{link}}</a></p>
      <p>{{additionalInfo}}</p>
    </div>
    <div class="footer">
      <p>This email was sent by Idea Tracker</p>
    </div>
  </div>
</body>
</html>
`;

const compileTemplate = (data) => {
  const template = handlebars.compile(emailTemplate);
  return template(data);
};

module.exports = { compileTemplate };
