const HttpCode = require('../models/HttpCode');

// Get all HTTP codes
exports.getAllCodes = async (req, res) => {
  try {
    const codes = await HttpCode.find().sort({ code: 1 });
    res.json(codes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Filter HTTP codes
exports.filterCodes = async (req, res) => {
    try {
      const { filter } = req.query;
      let query = {};
      
      if (filter) {
        // Handle pattern filters like 2xx, 20x, etc.
        if (/^\d+x+$/.test(filter)) {
          const pattern = filter.replace(/x/g, '.');
          const regex = new RegExp(`^${pattern}$`);
          
          // Convert string codes to numbers for comparison
          const allCodes = await HttpCode.find();
          const filteredCodes = allCodes.filter(code => 
            regex.test(code.code.toString())
          );
          
          return res.json(filteredCodes);
        } 
        // Exact code match
        else if (/^\d+$/.test(filter)) {
          query.code = parseInt(filter);
        }
      }
      
      const codes = await HttpCode.find(query).sort({ code: 1 });
      res.json(codes);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  
  // Initialize HTTP codes in the database
  exports.initializeHttpCodes = async () => {
    try {
      const count = await HttpCode.countDocuments();
      
      // Only initialize if no codes exist
      if (count === 0) {
        // Common HTTP status codes with descriptions
        const httpCodes = [
          // 1xx - Informational
          { code: 100, description: 'Continue', category: '1xx' },
          { code: 101, description: 'Switching Protocols', category: '1xx' },
          { code: 102, description: 'Processing', category: '1xx' },
          { code: 103, description: 'Early Hints', category: '1xx' },
          
          // 2xx - Success
          { code: 200, description: 'OK', category: '2xx' },
          { code: 201, description: 'Created', category: '2xx' },
          { code: 202, description: 'Accepted', category: '2xx' },
          { code: 203, description: 'Non-Authoritative Information', category: '2xx' },
          { code: 204, description: 'No Content', category: '2xx' },
          { code: 205, description: 'Reset Content', category: '2xx' },
          { code: 206, description: 'Partial Content', category: '2xx' },
          { code: 207, description: 'Multi-Status', category: '2xx' },
          { code: 208, description: 'Already Reported', category: '2xx' },
          { code: 226, description: 'IM Used', category: '2xx' },
          
          // 3xx - Redirection
          { code: 300, description: 'Multiple Choices', category: '3xx' },
          { code: 301, description: 'Moved Permanently', category: '3xx' },
          { code: 302, description: 'Found', category: '3xx' },
          { code: 303, description: 'See Other', category: '3xx' },
          { code: 304, description: 'Not Modified', category: '3xx' },
          { code: 305, description: 'Use Proxy', category: '3xx' },
          { code: 307, description: 'Temporary Redirect', category: '3xx' },
          { code: 308, description: 'Permanent Redirect', category: '3xx' },
          
          // 4xx - Client Errors
          { code: 400, description: 'Bad Request', category: '4xx' },
          { code: 401, description: 'Unauthorized', category: '4xx' },
          { code: 402, description: 'Payment Required', category: '4xx' },
          { code: 403, description: 'Forbidden', category: '4xx' },
          { code: 404, description: 'Not Found', category: '4xx' },
          { code: 405, description: 'Method Not Allowed', category: '4xx' },
          { code: 406, description: 'Not Acceptable', category: '4xx' },
          { code: 407, description: 'Proxy Authentication Required', category: '4xx' },
          { code: 408, description: 'Request Timeout', category: '4xx' },
          { code: 409, description: 'Conflict', category: '4xx' },
          { code: 410, description: 'Gone', category: '4xx' },
          { code: 411, description: 'Length Required', category: '4xx' },
          { code: 412, description: 'Precondition Failed', category: '4xx' },
          { code: 413, description: 'Payload Too Large', category: '4xx' },
          { code: 414, description: 'URI Too Long', category: '4xx' },
          { code: 415, description: 'Unsupported Media Type', category: '4xx' },
          { code: 416, description: 'Range Not Satisfiable', category: '4xx' },
          { code: 417, description: 'Expectation Failed', category: '4xx' },
          { code: 418, description: 'I\'m a teapot', category: '4xx' },
          { code: 421, description: 'Misdirected Request', category: '4xx' },
          { code: 422, description: 'Unprocessable Entity', category: '4xx' },
          { code: 423, description: 'Locked', category: '4xx' },
          { code: 424, description: 'Failed Dependency', category: '4xx' },
          { code: 425, description: 'Too Early', category: '4xx' },
          { code: 426, description: 'Upgrade Required', category: '4xx' },
          { code: 428, description: 'Precondition Required', category: '4xx' },
          { code: 429, description: 'Too Many Requests', category: '4xx' },
          { code: 431, description: 'Request Header Fields Too Large', category: '4xx' },
          { code: 451, description: 'Unavailable For Legal Reasons', category: '4xx' },
          
          // 5xx - Server Errors
          { code: 500, description: 'Internal Server Error', category: '5xx' },
          { code: 501, description: 'Not Implemented', category: '5xx' },
          { code: 502, description: 'Bad Gateway', category: '5xx' },
          { code: 503, description: 'Service Unavailable', category: '5xx' },
          { code: 504, description: 'Gateway Timeout', category: '5xx' },
          { code: 505, description: 'HTTP Version Not Supported', category: '5xx' },
          { code: 506, description: 'Variant Also Negotiates', category: '5xx' },
          { code: 507, description: 'Insufficient Storage', category: '5xx' },
          { code: 508, description: 'Loop Detected', category: '5xx' },
          { code: 510, description: 'Not Extended', category: '5xx' },
          { code: 511, description: 'Network Authentication Required', category: '5xx' }
        ];
        
        // Add image URLs
        httpCodes.forEach(code => {
          code.imageUrl = `https://http.dog/${code.code}.jpg`;
        });
        
        // Insert all codes
        await HttpCode.insertMany(httpCodes);
        console.log('HTTP codes initialized');
      }
    } catch (error) {
      console.error('Error initializing HTTP codes:', error);
    }
  };