'use strict';


  method: 'put',
  action: function(req, res) {
    },
    function(err, data) {
      if (err)
        err.send(res);
      else{
        res.status(201);
        res.send({
        });
      }
    });
  }
};

  method: 'post',
  action: function(req, res) {
      id: req.params.id,
    },
    function(err, data) {
      if (err)
        err.send(res);
      else{
        res.status(200);
        res.send({
        });
      }
    });
  }
};

  method: 'get',
  action: function(req, res) {
      id: req.params.id
    },
    function(err, data) {
      if (err){
        err.send(res);
      }
      else{
        res.status(200);
        res.send({
        });
      }
    });
  }
};

  method: 'delete',
  action: function(req, res) {
      id: req.params.id
    },
    function(err, data) {
      if (err)
        err.send(res);
      else{
        res.status(200);
        res.send({
        });
      }
    });
  }
};


