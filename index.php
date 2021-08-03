<!DOCTYPE html>
<html lang="en" class="no-js">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="apple-mobile-web-app-capable" content="yes">
    <meta name="mobile-web-app-capable" content="yes">

    <title>Formstone</title>

    <link rel="stylesheet" href="/dist/css/grid.css">
    <link rel="stylesheet" href="/dist/css/background.css">

    <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>

    <!-- <script src="https://cdn.jsdelivr.net/npm/umbrellajs"></script>
    <script src="/dist/js/core-umbrella.js"></script> -->
    <script src="/dist/js/core.js"></script>

    <script src="/dist/js/background.js"></script>

    <script src="/dist/js/cookie.js"></script>
    <script src="/dist/js/mediaquery.js"></script>

    <script src="/dist/js/swap.js"></script>

    <script src="/dist/js/jquery.js"></script>

    <!-- <script src="//www.youtube.com/iframe_api"></script> -->


    <style>

      html,
      body {
        font-family: sans-serif;
        margin: 0;
        padding: 0;
      }

      body {
        padding: 20px;
      }

      .fs-cell {
        background: #eee;
        margin: 5px;
        padding: 10px;
      }

      .demo-xs,
      .demo-sm,
      .demo-md,
      .demo-lg,
      .demo-xl {
        display: none;
      }

      @media (max-width: 739px) {

        .demo-sm {
          display: block;
        }
      }

      @media (min-width: 740px) and (max-width: 979px) {

        .demo-md {
          display: block;
        }
      }

      @media (min-width: 980px) {

        .demo-lg {
          display: block;
        }
      }

      /* ----- */

      .wrapper {
        width: 90%;
        max-width: 1200px;

        margin: 100px auto;
      }

      .background {
        height: 0;
        width: 100%;

        background: #ccc;
        padding-bottom: 50%;
      }


      .swap {
        background: red;
        color: white;
        margin-bottom: 10px;
        padding: 20px;
      }
      .swap:before {
        content: 'uninitialized ';
      }
      .swap.fs-swap-element {
        background: orange;
      }
      .swap.fs-swap-element:before {
        content: 'initialized ';
      }
      .swap.fs-swap-enabled {
        background: green;
      }
      .swap.fs-swap-enabled:before {
        content: 'enabled ';
      }
      .swap.fs-swap-active {
        background: blue;
      }
      .swap.fs-swap-active:before {
        content: 'active ';
      }

      .swap_target {
        border: 2px solid red;
        margin-bottom: 40px;
        padding: 20px;
      }
      .swap_target:before {
        content: 'uninitialized ';
      }
      .swap_target.fs-swap-target {
        border-color: orange;
      }
      .swap_target.fs-swap-target:before {
        content: 'initialized ';
      }
      .swap_target.fs-swap-enabled {
        border-color: green;
      }
      .swap_target.fs-swap-enabled:before {
        content: 'enabled ';
      }
      .swap_target.fs-swap-active {
        border-color: blue;
      }
      .swap_target.fs-swap-active:before {
        content: 'active ';
      }

    </style>

  </head>
  <body class="fs-grid">


<form action="#" medthod="GET" class="fs-row form demo_form">
  <div class="fs-cell fs-xs-full fs-sm-third fs-md-third fs-lg-third">
    <h4 class="no_margin_top">Set Cookie</h4>
    <div class="fs-row">
      <div class="fs-cell fs-xs-half">
        <label class="form_label">Key</label>
        <input type="text" name="set_key" value="foo" class="form_input">
      </div>
      <div class="fs-cell fs-xs-half">
        <label class="form_label">Value</label>
        <input type="text" name="set_value" value="bar" class="form_input">
      </div>
    </div>
    <input type="submit" class="button form_button set" value="Set">
  </div>
  <div class="fs-cell fs-xs-full fs-sm-third fs-md-third fs-lg-third">
    <h4 class="no_margin_top">Get Cookie</h4>
    <label class="form_label">Key</label>
    <input type="text" name="get_key" value="foo" class="form_input">
    <input type="submit" class="button form_button get" value="Get">
  </div>
  <div class="fs-cell fs-xs-full fs-sm-third fs-md-third fs-lg-third">
    <h4 class="no_margin_top">Erase Cookie</h4>
    <label class="form_label">Key</label>
    <input type="text" name="erase_key" value="foo" class="form_input">
    <input type="submit" class="button form_button erase" value="Erase">
  </div>
</form>
<div class="demo_output_cookie form_textarea"></div>


    <hr>

    <div class="demo_output demo_basic form_textarea"></div>

    <!-- END: FIRSTDEMO -->

    <h4>Binding</h2>
    <div class="demo_output demo_binding form_textarea"></div>

    <hr>

    <h2>Swap</h2>

    <div class="swap js-swap" data-swap-target=".toggle_target_0">Handle</div>
    <div class="swap_target toggle_target_0">Content</div>

    <h3>Group</h3>

    <div class="swap js-swap" data-swap-target=".toggle_target_1" data-swap-group="toggle_group_1">Handle</div>
    <div class="swap_target toggle_target_1">Content</div>
    <div class="swap js-swap" data-swap-target=".toggle_target_2" data-swap-group="toggle_group_1">Handle</div>
    <div class="swap_target toggle_target_2">Content</div>

    <h3>Group (No Collapse)</h3>

    <div class="swap js-swap" data-swap-options='{"collapse":false}' data-swap-target=".toggle_target_3" data-swap-group="toggle_group_2">Handle 1</div>
    <div class="swap_target toggle_target_3">Content 1</div>
    <div class="swap js-swap" data-swap-options='{"collapse":false}' data-swap-target=".toggle_target_4" data-swap-group="toggle_group_2" data-swap-active="true">Handle 2</div>
    <div class="swap_target toggle_target_4">Content 2</div>

    <h3>Linked Handles</h3>

    <div class="swap js-swap" data-swap-target=".toggle_target_6" data-swap-linked="toggle_linked" data-swap-group="toggle_group_3">Handle 1 - Group 1</div>
    <div class="swap_target toggle_target_6">Content</div>
    <div class="swap js-swap" data-swap-target=".toggle_target_6" data-swap-linked="toggle_linked" data-swap-group="toggle_group_3">Handle 2 - Group 1</div>

    <div class="swap js-swap" data-swap-target=".toggle_target_7" data-swap-linked="toggle_linked_2" data-swap-group="toggle_group_3">Handle 1 - Group 2</div>
    <div class="swap_target toggle_target_7">Content 2</div>
    <div class="swap js-swap" data-swap-target=".toggle_target_7" data-swap-linked="toggle_linked_2" data-swap-group="toggle_group_3">Handle 2 - Group 2</div>

    <h3>Max Width</h3>

    <div class="swap js-swap" data-swap-target=".toggle_target_8" data-swap-options='{"maxWidth":"740px"}'>Handle</div>
    <div class="swap_target toggle_target_8">Content</div>



    <div class="wrapper">
      <div class="background js-background js-bg-1" data-background-options='{"source":"https://spacehold.it/1600x900/1.jpg","alt":"Background Image"}'></div>
    </div>
    <div class="wrapper">
      <div class="background js-background js-bg-2" data-background-options='{"source":{"0px":"https://spacehold.it/800x450/2.jpg","980px":"https://spacehold.it/1600x900/2.jpg"},"alt":"Background Image"}'></div>
    </div>
    <div class="wrapper">
      <div class="background js-background js-bg-3" data-background-options='{"source":{"webm":"https://spacehold.it/video/video.webm","mp4":"https://spacehold.it/video/video.mp4","ogg":"https://spacehold.it/video/video.ogv","poster":"https://spacehold.it/video/poster.jpg"},"alt":"Background Video"}'></div>
    </div>
    <div class="wrapper">
      <div class="background js-background js-bg-4" data-background-options='{"source":"https://spacehold.it/1600x900/3.jpg","lazy":true,"alt":"Background Image"}'></div>
    </div>
    <div class="wrapper">
      <div class="background js-background js-bg-4" data-background-options='{"source":{"video":"https://www.youtube.com/watch?v=LlQ8dhdSjWs"},"lazy":true}'></div>
    </div>


    <script>
      // console.log(typeof Formstone.Ready);

      // Formstone.Ready(function() {

      //   console.log(Formstone(".js-background").background());

      //   console.log(Formstone(".js-bg-1").background());

      //   var bg2 = document.querySelectorAll(".js-bg-2");
      //   console.log(typeof Formstone(bg2).background());

      // //   // $(".jq-background").background();

      // //   // console.log($(".jq-background"));


      // //   console.log(Formstone);

      // //   var background1 = Formstone.background(".js-bg-1", { foo: "bar" });

      // //   console.log(background1);

      // //   console.log(background1.data());


      // //   // var background2 = Formstone.background( document.querySelector(".js-bg-2") );

      // //   // var backgroundGroup = Formstone.background( document.querySelectorAll(".js-background") );

      // //   // console.log(background1, background2, backgroundGroup);


      // //   Formstone(".js-bg-1").background();


      // //   // Formstone.background(background1, "unload");

      // //   // Formstone.background(document.querySelector(".js-bg-2"), "destroy");

      // });


      //



Formstone.onReady(function() {


  // console.log( Formstone(".js-swap").swap({ var: 'val' }) );
  // console.log( $(".js-swap").swap({ var: 'val' }) );

  $(".js-swap").swap(); //"publicMethod", { var: 'val' });

  // TODO make events work
  Formstone(".js-swap").on('enable.swap', function() { console.log('Enable', arguments); });
  Formstone(".js-swap").on('disable.swap', function() { console.log('Disable', arguments); });
  $(".js-swap").on('activate.swap', function() { console.log('Activate', arguments); });
  $(".js-swap").on('deactivate.swap', function() { console.log('Deactivate', arguments); });


  Formstone(".js-background").background();

  // console.log( Formstone(".js-bg-1").background({ var: 'val' }) );

  // Formstone(".js-bg-1").background(); //"publicMethod", { var: 'val' });

  // var bg2 = document.querySelectorAll(".js-bg-2");
  // console.log(typeof Formstone(bg2).background());

});


// console.log( Formstone(".js-background") );

// Formstone(".js-background").each(function() {
//   console.log(arguments);
// });


  Formstone.onReady(function() {
    Formstone('body').on("mqchange", logChange);

    if (!Formstone.mediaquery("state")) {
      Formstone.mediaquery({
        minWidth     : [ 320, 500, 740, 980, 1220 ],
        maxWidth     : [ 1220, 980, 740, 500, 320 ],
        minHeight    : [ 400, 800 ],
        maxHeight    : [ 800, 400 ]
      });
    } else {
      logChange({}, Formstone.mediaquery("state"));
    }

    Formstone.mediaquery("bind", "demo", "(min-width: 740px)", {
      enter: logBind,
      leave: logBind
    });

  });

  function logChange(e, state) {
    var html = "";
    html += "<p><span>Change:</span><span>MinWidth:</span>" + state.minWidth + "<br>";
    html += "<span></span><span>MaxWidth:</span>"+ state.maxWidth + "<br>";
    html += "<span></span><span>MinHeight:</span>"+ state.minHeight + "<br>";
    html += "<span></span><span>MaxHeight:</span>"+ state.maxHeight + "</p>";

    Formstone(".demo_basic").prepend(html);
  }

  function logBind() {
    var mql = this,
      type = mql.matches ? "Enter" : "Leave"
      html = "<p><span>" + type + ":</span>" + mql.media + "<br>";

    Formstone(".demo_binding").prepend(html);
  }



  var $demoForm,
    $demoOutput;

  Formstone.onReady(function() {
    $demoForm = $(".demo_form"); // JQ
    $demoOutput = $(".demo_output_cookie"); // JQ

    $demoForm.on("click.cookie", ".set", setCookie)
         .on("click.cookie", ".get", getCookie)
         .on("click.cookie", ".erase", eraseCookie);
  });

  function setCookie(e) {
    Formstone.killEvent(e);

    var key   = $demoForm.find("[name=set_key]").val(),
      value = $demoForm.find("[name=set_value]").val();

    Formstone.cookie(key, value);

    output("Set", key + " = " + value);
  }

  function getCookie(e) {
    Formstone.killEvent(e);

    var key   = $demoForm.find("[name=get_key]").val(),
      value = Formstone.cookie(key);

    output("Get", key + " = " + value);
  }

  function eraseCookie(e) {
    Formstone.killEvent(e);

    var key = $demoForm.find("[name=erase_key]").val();

    Formstone.cookie(key, null);

    output("Erase", key);
  }

  function output(label, value) {
    $demoOutput.prepend('<strong>' + label + ': </strong>' + value + '</span><br>');
  }




    </script>



<!-- Grid -->


    <hr>

    <h2>Order</h2>

    <div class="fs-row">
      <div class="fs-cell  fs-md-2 fs-lg-4 fs-all-last">First in source</div>
      <div class="fs-cell  fs-md-2 fs-lg-4 fs-all-first">Second in source</div>
      <div class="fs-cell  fs-md-2 fs-lg-4">Last in source</div>
    </div>

    <h2>Alignment</h2>

    <h3>fs-all-align-center</h3>

    <div class="fs-row fs-sm-2 fs-md-4 fs-lg-4 fs-all-align-center">
      <div class="fs-cell fs-sm-1 fs-md-1 fs-lg-1" style="min-height: 100px;">Lorem Cras Mattis</div>
      <div class="fs-cell fs-sm-1 fs-md-1 fs-lg-1 fs-all-align-start">fs-all-align-start</div>
      <div class="fs-cell fs-sm-1 fs-md-1 fs-lg-1 fs-all-align-end">fs-all-align-end</div>
      <div class="fs-cell fs-sm-1 fs-md-1 fs-lg-1" style="min-height: 200px;">Vestibulum id ligula porta felis euismod semper.</div>
    </div>

    <h2>Justification</h2>

    <h3>fs-all-justify-start</h3>

    <div class="fs-row fs-all-justify-start">
      <div class="fs-cell fs-sm-1 fs-md-2 fs-lg-4">Cell</div>
      <div class="fs-cell fs-sm-1 fs-md-2 fs-lg-4">Cell</div>
      <div class="fs-cell fs-sm-1 fs-md-2 fs-lg-4">Cell</div>
    </div>

    <h3>fs-all-justify-center</h3>

    <div class="fs-row fs-all-justify-center">
      <div class="fs-cell fs-sm-1 fs-md-2 fs-lg-4">Cell</div>
      <div class="fs-cell fs-sm-1 fs-md-2 fs-lg-4">Cell</div>
      <div class="fs-cell fs-sm-1 fs-md-2 fs-lg-4">Cell</div>
    </div>

    <h3>fs-all-justify-end</h3>

    <div class="fs-row fs-all-justify-end">
      <div class="fs-cell fs-sm-1 fs-md-2 fs-lg-4">Cell</div>
      <div class="fs-cell fs-sm-1 fs-md-2 fs-lg-4">Cell</div>
      <div class="fs-cell fs-sm-1 fs-md-2 fs-lg-4">Cell</div>
    </div>

    <h2>Natural</h2>

    <div class="fs-row">

      <?php
        for ($i = 1; $i <= 12; $i++) :
          $class_sm = 'fs-sm-' . ceil($i / 4);
          $class_md = 'fs-md-' . ceil($i / 2);
          $class_lg = 'fs-lg-' . $i;
      ?>
      <div class="fs-cell
        <?php echo $class_sm; ?>
        <?php echo $class_md; ?>
        <?php echo $class_lg; ?>
      ">
        <span class="demo-sm"><?php echo $class_sm; ?></span>
        <span class="demo-md"><?php echo $class_md; ?></span>
        <span class="demo-lg"><?php echo $class_lg; ?></span>
      </div>
        <?php
          if ($i < 12) :
            $class_sm = 'fs-sm-' . floor((12 - $i) / 4);
            $class_md = 'fs-md-' . floor((12 - $i) / 2);
            $class_lg = 'fs-lg-' . (12 - $i);
        ?>
        <div class="fs-cell
          <?php echo $class_sm; ?>
          <?php echo $class_md; ?>
          <?php echo $class_lg; ?>
        ">
          <span class="demo-sm"><?php echo $class_sm; ?></span>
          <span class="demo-md"><?php echo $class_md; ?></span>
          <span class="demo-lg"><?php echo $class_lg; ?></span>
        </div>
        <?php
          endif;
        ?>
      <?php
        endfor;
      ?>

    </div>

    <h2>From x To x</h2>

    <div class="fs-row">

      <?php
        for ($i = 1; $i <= 12; $i++) :
          for ($j = $i; $j <= 12; $j++) :
      ?>
      <div class="fs-cell fs-lg-from-<?php echo $i; ?>-to-<?php echo $j; ?>">
        fs-lg-from-<?php echo $i; ?>-to-<?php echo $j; ?>
      </div>
      <?php
          endfor;
        endfor;
      ?>

    </div>

    <h2>Span x At x</h2>

    <div class="fs-row">

      <?php
        for ($i = 1; $i <= 12; $i++) :
          for ($j = 1; $j <= (13 - $i); $j++) :
      ?>
      <div class="fs-cell fs-lg-from-<?php echo $i; ?>-span-<?php echo $j; ?>">
        fs-lg-from-<?php echo $i; ?>-span-<?php echo $j; ?>
      </div>
      <?php
          endfor;
        endfor;
      ?>

    </div>

  </body>
</html>