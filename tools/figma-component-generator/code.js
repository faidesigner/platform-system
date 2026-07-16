const SPECS = [
  {
    "id": "badge",
    "template": "badge",
    "name": "Badge",
    "description": "Read-only status and category badge generated from feature/badge-component.",
    "component": {
      "minWidth": 48,
      "height": 20,
      "radius": 9999,
      "layout": {
        "direction": "horizontal",
        "gap": 4,
        "primarySizing": "AUTO",
        "counterSizing": "FIXED",
        "primaryAlign": "CENTER",
        "counterAlign": "CENTER",
        "padding": {
          "top": 0,
          "right": 8,
          "bottom": 0,
          "left": 8
        }
      }
    },
    "text": {
      "fontStyle": "Medium",
      "fontSize": 12,
      "lineHeight": 18,
      "color": "#1f2023"
    },
    "icon": {
      "size": 6
    },
    "variants": [
      {
        "name": "variant=neutral, icon=false",
        "label": "Neutral",
        "icon": false,
        "fill": "#e4e6e7",
        "text": "#1f2023"
      },
      {
        "name": "variant=info, icon=false",
        "label": "Info",
        "icon": false,
        "fill": "#2388f6",
        "text": "#ffffff"
      },
      {
        "name": "variant=success, icon=false",
        "label": "Success",
        "icon": false,
        "fill": "#17cf81",
        "text": "#ffffff"
      },
      {
        "name": "variant=warning, icon=false",
        "label": "Warning",
        "icon": false,
        "fill": "#fc7a03",
        "text": "#ffffff"
      },
      {
        "name": "variant=error, icon=false",
        "label": "Error",
        "icon": false,
        "fill": "#ea3b2a",
        "text": "#ffffff"
      },
      {
        "name": "variant=blue, icon=false",
        "label": "Blue",
        "icon": false,
        "fill": "#f0f7fe",
        "text": "#2388f6"
      },
      {
        "name": "variant=mint, icon=false",
        "label": "Mint",
        "icon": false,
        "fill": "#e3fcf1",
        "text": "#17cf81"
      },
      {
        "name": "variant=orange, icon=false",
        "label": "Orange",
        "icon": false,
        "fill": "#fff7f0",
        "text": "#fc7a03"
      },
      {
        "name": "variant=red, icon=false",
        "label": "Red",
        "icon": false,
        "fill": "#fef6f6",
        "text": "#ea3b2a"
      },
      {
        "name": "variant=yellow, icon=false",
        "label": "Yellow",
        "icon": false,
        "fill": "#fffaeb",
        "text": "#e3ab03"
      },
      {
        "name": "variant=green, icon=false",
        "label": "Green",
        "icon": false,
        "fill": "#e4fbdf",
        "text": "#36cd1e"
      },
      {
        "name": "variant=indigo, icon=false",
        "label": "Indigo",
        "icon": false,
        "fill": "#eff1fb",
        "text": "#374cc3"
      },
      {
        "name": "variant=purple, icon=false",
        "label": "Purple",
        "icon": false,
        "fill": "#f4f1fd",
        "text": "#693eea"
      },
      {
        "name": "variant=grape, icon=false",
        "label": "Grape",
        "icon": false,
        "fill": "#fbf1fd",
        "text": "#cf59ec"
      },
      {
        "name": "variant=gray, icon=false",
        "label": "Gray",
        "icon": false,
        "fill": "#f5f5f5",
        "text": "#61646b"
      },
      {
        "name": "variant=neutral, icon=true",
        "label": "Neutral",
        "icon": true,
        "fill": "#e4e6e7",
        "text": "#1f2023"
      }
    ]
  },
  {
    "id": "banner",
    "template": "banner",
    "name": "Banner",
    "description": {
      "fontSize": 12,
      "lineHeight": 18,
      "color": "#3a3d40"
    },
    "preview": {
      "stepY": 156
    },
    "component": {
      "width": 720,
      "minHeight": 72,
      "radius": 8
    },
    "header": {
      "minHeight": 56,
      "layout": {
        "direction": "horizontal",
        "gap": 8,
        "primarySizing": "FIXED",
        "counterSizing": "AUTO",
        "primaryAlign": "MIN",
        "counterAlign": "MIN",
        "padding": {
          "top": 12,
          "right": 16,
          "bottom": 12,
          "left": 16
        }
      }
    },
    "copy": {
      "width": 560,
      "gap": 2
    },
    "title": {
      "fontSize": 14,
      "lineHeight": 21,
      "color": "#1f2023"
    },
    "icon": {
      "size": 20,
      "fontSize": 16,
      "lineHeight": 20,
      "color": "#2388f6"
    },
    "actions": {
      "gap": 4
    },
    "actionIcon": {
      "size": 20,
      "fontSize": 16,
      "lineHeight": 20,
      "color": "#3a3d40"
    },
    "content": {
      "minHeight": 56,
      "fill": "#ffffff",
      "stroke": "#e4e6e7",
      "strokeWeight": 1,
      "label": "Additional banner content",
      "layout": {
        "direction": "horizontal",
        "gap": 8,
        "primarySizing": "FIXED",
        "counterSizing": "AUTO",
        "primaryAlign": "MIN",
        "counterAlign": "CENTER",
        "padding": {
          "top": 12,
          "right": 16,
          "bottom": 12,
          "left": 16
        }
      }
    },
    "variants": [
      {
        "name": "status=info, container=card, expanded=false, dismissable=false",
        "status": "info",
        "container": "card",
        "expanded": false,
        "dismissable": false,
        "title": "New update available",
        "description": "Review the latest system notice.",
        "icon": "i",
        "fill": "#f0f7fe",
        "iconColor": "#2388f6"
      },
      {
        "name": "status=success, container=card, expanded=false, dismissable=false",
        "status": "success",
        "container": "card",
        "expanded": false,
        "dismissable": false,
        "title": "Changes saved",
        "description": "Your update has been published.",
        "icon": "v",
        "fill": "#e3fcf1",
        "iconColor": "#17cf81"
      },
      {
        "name": "status=warning, container=card, expanded=false, dismissable=false",
        "status": "warning",
        "container": "card",
        "expanded": false,
        "dismissable": false,
        "title": "Action required",
        "description": "Check the configuration before continuing.",
        "icon": "!",
        "fill": "#fff7f0",
        "iconColor": "#fc7a03"
      },
      {
        "name": "status=error, container=card, expanded=false, dismissable=false",
        "status": "error",
        "container": "card",
        "expanded": false,
        "dismissable": false,
        "title": "Something went wrong",
        "description": "Please resolve the issue and try again.",
        "icon": "!",
        "fill": "#fef6f6",
        "iconColor": "#ea3b2a"
      },
      {
        "name": "status=info, container=card, expanded=true, dismissable=true",
        "status": "info",
        "container": "card",
        "expanded": true,
        "dismissable": true,
        "title": "New update available",
        "description": "Review the latest system notice.",
        "icon": "i",
        "fill": "#f0f7fe",
        "iconColor": "#2388f6"
      },
      {
        "name": "status=warning, container=section, expanded=false, dismissable=true",
        "status": "warning",
        "container": "section",
        "expanded": false,
        "dismissable": true,
        "title": "Scheduled maintenance",
        "description": "Some services may be temporarily unavailable.",
        "icon": "!",
        "fill": "#fff7f0",
        "iconColor": "#fc7a03"
      }
    ]
  },
  {
    "id": "breadcrumbs",
    "template": "breadcrumbs",
    "name": "Breadcrumbs",
    "description": "Breadcrumb trail generated from feature/badge-component.",
    "preview": {
      "stepY": 72
    },
    "component": {
      "layout": {
        "direction": "horizontal",
        "gap": 4,
        "primarySizing": "AUTO",
        "counterSizing": "AUTO",
        "primaryAlign": "MIN",
        "counterAlign": "CENTER",
        "padding": {
          "top": 0,
          "right": 0,
          "bottom": 0,
          "left": 0
        }
      }
    },
    "item": {
      "layout": {
        "direction": "horizontal",
        "gap": 4,
        "primarySizing": "AUTO",
        "counterSizing": "AUTO",
        "primaryAlign": "MIN",
        "counterAlign": "CENTER",
        "padding": {
          "top": 4,
          "right": 0,
          "bottom": 4,
          "left": 0
        }
      }
    },
    "separator": {
      "color": "#3a3d40"
    },
    "text": {
      "default": {
        "fontSize": 14,
        "lineHeight": 21,
        "color": "#3a3d40"
      },
      "supporting": {
        "fontSize": 12,
        "lineHeight": 18,
        "color": "#3a3d40"
      }
    },
    "variants": [
      {
        "name": "variant=default, separator=slash, depth=3",
        "variant": "default",
        "separator": "/",
        "items": [
          "Home",
          "Products",
          "Analytics"
        ],
        "linkColor": "#3a3d40",
        "currentColor": "#1f2023"
      },
      {
        "name": "variant=supporting, separator=slash, depth=4",
        "variant": "supporting",
        "separator": "/",
        "items": [
          "Home",
          "Admin",
          "Settings",
          "Members"
        ],
        "linkColor": "#3a3d40",
        "currentColor": "#3a3d40"
      }
    ]
  },
  {
    "id": "button-group",
    "template": "button-group",
    "name": "ButtonGroup",
    "description": "Connected action button group generated from feature/badge-component.",
    "preview": {
      "stepY": 112
    },
    "button": {
      "width": 88,
      "height": {
        "m": 40,
        "s": 26
      },
      "strokeWeight": 1,
      "layout": {
        "m": {
          "direction": "horizontal",
          "gap": 4,
          "primarySizing": "FIXED",
          "counterSizing": "FIXED",
          "primaryAlign": "CENTER",
          "counterAlign": "CENTER",
          "padding": {
            "top": 8,
            "right": 16,
            "bottom": 8,
            "left": 16
          }
        },
        "s": {
          "direction": "horizontal",
          "gap": 4,
          "primarySizing": "FIXED",
          "counterSizing": "FIXED",
          "primaryAlign": "CENTER",
          "counterAlign": "CENTER",
          "padding": {
            "top": 4,
            "right": 12,
            "bottom": 4,
            "left": 12
          }
        }
      },
      "text": {
        "m": {
          "fontSize": 13,
          "lineHeight": 20
        },
        "s": {
          "fontSize": 12,
          "lineHeight": 18
        }
      }
    },
    "variants": [
      {
        "name": "orientation=horizontal, shape=square, size=m, tone=secondary",
        "orientation": "horizontal",
        "shape": "square",
        "size": "m",
        "radius": 8,
        "fill": "#ffffff",
        "stroke": "#d2d3d5",
        "text": "#1f2023",
        "items": [
          {
            "label": "Copy"
          },
          {
            "label": "Cut"
          },
          {
            "label": "Paste"
          }
        ]
      },
      {
        "name": "orientation=horizontal, shape=round, size=m, tone=secondary",
        "orientation": "horizontal",
        "shape": "round",
        "size": "m",
        "radius": 9999,
        "fill": "#ffffff",
        "stroke": "#d2d3d5",
        "text": "#1f2023",
        "items": [
          {
            "label": "Left"
          },
          {
            "label": "Center"
          },
          {
            "label": "Right"
          }
        ]
      },
      {
        "name": "orientation=vertical, shape=square, size=s, tone=secondary",
        "orientation": "vertical",
        "shape": "square",
        "size": "s",
        "radius": 8,
        "fill": "#ffffff",
        "stroke": "#d2d3d5",
        "text": "#1f2023",
        "items": [
          {
            "label": "One"
          },
          {
            "label": "Two"
          },
          {
            "label": "Three"
          }
        ]
      }
    ]
  },
  {
    "id": "button",
    "template": "button",
    "name": "Button",
    "description": "Action button generated from feature/badge-component.",
    "preview": {
      "stepY": 72
    },
    "component": {
      "width": 128,
      "height": {
        "xl": 56,
        "l": 40,
        "m": 36,
        "s": 26
      },
      "strokeWeight": 1,
      "iconOnly": false,
      "layout": {
        "xl": {
          "direction": "horizontal",
          "gap": 4,
          "primarySizing": "FIXED",
          "counterSizing": "FIXED",
          "primaryAlign": "CENTER",
          "counterAlign": "CENTER",
          "padding": {
            "top": 16,
            "right": 24,
            "bottom": 16,
            "left": 24
          }
        },
        "l": {
          "direction": "horizontal",
          "gap": 4,
          "primarySizing": "FIXED",
          "counterSizing": "FIXED",
          "primaryAlign": "CENTER",
          "counterAlign": "CENTER",
          "padding": {
            "top": 8,
            "right": 20,
            "bottom": 8,
            "left": 20
          }
        },
        "m": {
          "direction": "horizontal",
          "gap": 4,
          "primarySizing": "FIXED",
          "counterSizing": "FIXED",
          "primaryAlign": "CENTER",
          "counterAlign": "CENTER",
          "padding": {
            "top": 8,
            "right": 16,
            "bottom": 8,
            "left": 16
          }
        },
        "s": {
          "direction": "horizontal",
          "gap": 4,
          "primarySizing": "FIXED",
          "counterSizing": "FIXED",
          "primaryAlign": "CENTER",
          "counterAlign": "CENTER",
          "padding": {
            "top": 4,
            "right": 12,
            "bottom": 4,
            "left": 12
          }
        }
      }
    },
    "text": {
      "xl": {
        "fontSize": 16,
        "lineHeight": 24
      },
      "l": {
        "fontSize": 14,
        "lineHeight": 21
      },
      "m": {
        "fontSize": 13,
        "lineHeight": 20
      },
      "s": {
        "fontSize": 12,
        "lineHeight": 18
      }
    },
    "icon": {
      "xl": {
        "size": 16,
        "fontSize": 14,
        "lineHeight": 16
      },
      "l": {
        "size": 16,
        "fontSize": 14,
        "lineHeight": 16
      },
      "m": {
        "size": 14,
        "fontSize": 12,
        "lineHeight": 14
      },
      "s": {
        "size": 12,
        "fontSize": 11,
        "lineHeight": 12
      }
    },
    "variants": [
      {
        "name": "tone=primary, size=m, shape=square, icon=false",
        "tone": "primary",
        "size": "m",
        "label": "Primary",
        "radius": 8,
        "fill": "#2c2d30",
        "stroke": "#00000000",
        "text": "#ffffff"
      },
      {
        "name": "tone=secondary, size=m, shape=square, icon=false",
        "tone": "secondary",
        "size": "m",
        "label": "Secondary",
        "radius": 8,
        "fill": "#ffffff",
        "stroke": "#d2d3d5",
        "text": "#1f2023"
      },
      {
        "name": "tone=tertiary, size=m, shape=square, icon=false",
        "tone": "tertiary",
        "size": "m",
        "label": "Tertiary",
        "radius": 8,
        "fill": "#ffffff",
        "stroke": "#e4e6e7",
        "text": "#3a3d40"
      },
      {
        "name": "tone=primary, size=m, shape=round, icon=true",
        "tone": "primary",
        "size": "m",
        "label": "Continue",
        "icon": "+",
        "radius": 9999,
        "fill": "#2c2d30",
        "stroke": "#00000000",
        "text": "#ffffff"
      },
      {
        "name": "tone=secondary, size=s, shape=square, icon=false",
        "tone": "secondary",
        "size": "s",
        "label": "Small",
        "radius": 8,
        "fill": "#ffffff",
        "stroke": "#d2d3d5",
        "text": "#1f2023"
      }
    ]
  },
  {
    "id": "calendar",
    "template": "calendar",
    "name": "Calendar",
    "description": "Single and range calendar generated from feature/badge-component.",
    "preview": {
      "stepY": 376
    },
    "component": {
      "width": 280,
      "height": 336,
      "gap": 8,
      "fill": "#00000000"
    },
    "header": {
      "layout": {
        "direction": "horizontal",
        "gap": 24,
        "primarySizing": "AUTO",
        "counterSizing": "AUTO",
        "primaryAlign": "CENTER",
        "counterAlign": "CENTER",
        "padding": {
          "top": 0,
          "right": 0,
          "bottom": 0,
          "left": 0
        }
      },
      "text": {
        "fontSize": 14,
        "lineHeight": 21,
        "color": "#1f2023"
      },
      "icon": {
        "size": 24,
        "fontSize": 16,
        "lineHeight": 24,
        "color": "#1f2023"
      }
    },
    "weekdays": [
      "Sun",
      "Mon",
      "Tue",
      "Wed",
      "Thu",
      "Fri",
      "Sat"
    ],
    "weekdayText": {
      "fontSize": 12,
      "lineHeight": 18,
      "color": "#61646b"
    },
    "cell": {
      "size": 40,
      "radius": 8,
      "layout": {
        "direction": "horizontal",
        "gap": 0,
        "primarySizing": "FIXED",
        "counterSizing": "FIXED",
        "primaryAlign": "CENTER",
        "counterAlign": "CENTER",
        "padding": {
          "top": 0,
          "right": 0,
          "bottom": 0,
          "left": 0
        }
      },
      "text": {
        "fontSize": 14,
        "lineHeight": 21,
        "color": "#1f2023"
      },
      "states": {
        "default": {
          "fill": "#00000000",
          "text": "#1f2023"
        },
        "selected": {
          "fill": "#2c2d30",
          "text": "#ffffff"
        },
        "in-range": {
          "fill": "#2C2D300F",
          "text": "#1f2023"
        },
        "outside": {
          "fill": "#00000000",
          "text": "#a1a5aa"
        }
      }
    },
    "variants": [
      {
        "name": "mode=single, selected=true, outsideDays=true",
        "mode": "single",
        "month": "July 2026"
      },
      {
        "name": "mode=range, selected=true, outsideDays=true",
        "mode": "range",
        "month": "July 2026"
      }
    ]
  },
  {
    "id": "card",
    "template": "card",
    "name": "Card",
    "description": {
      "fontSize": 12,
      "lineHeight": 18,
      "color": "#3a3d40"
    },
    "preview": {
      "stepY": 176
    },
    "component": {
      "width": 320,
      "height": 128,
      "radius": 16,
      "strokeWeight": 1,
      "layout": {
        "none": {
          "direction": "vertical",
          "gap": 8,
          "primarySizing": "FIXED",
          "counterSizing": "FIXED",
          "primaryAlign": "MIN",
          "counterAlign": "MIN",
          "padding": {
            "top": 0,
            "right": 0,
            "bottom": 0,
            "left": 0
          }
        },
        "s": {
          "direction": "vertical",
          "gap": 8,
          "primarySizing": "FIXED",
          "counterSizing": "FIXED",
          "primaryAlign": "MIN",
          "counterAlign": "MIN",
          "padding": {
            "top": 16,
            "right": 16,
            "bottom": 16,
            "left": 16
          }
        },
        "m": {
          "direction": "vertical",
          "gap": 8,
          "primarySizing": "FIXED",
          "counterSizing": "FIXED",
          "primaryAlign": "MIN",
          "counterAlign": "MIN",
          "padding": {
            "top": 24,
            "right": 24,
            "bottom": 24,
            "left": 24
          }
        },
        "l": {
          "direction": "vertical",
          "gap": 8,
          "primarySizing": "FIXED",
          "counterSizing": "FIXED",
          "primaryAlign": "MIN",
          "counterAlign": "MIN",
          "padding": {
            "top": 32,
            "right": 32,
            "bottom": 32,
            "left": 32
          }
        }
      },
      "shadow": "0px 1px 3px 0px rgba(0, 0, 0, 0.09)"
    },
    "title": {
      "fontSize": 16,
      "lineHeight": 24,
      "color": "#1f2023"
    },
    "indicator": {
      "size": 20,
      "fill": "#39db1f"
    },
    "variants": [
      {
        "name": "type=card, variant=default, padding=m, selected=false",
        "padding": "m",
        "title": "Default card",
        "description": "Container for related content.",
        "fill": "#ffffff",
        "stroke": "#e4e6e7",
        "selected": false
      },
      {
        "name": "type=clickable, variant=default, padding=m, selected=false",
        "padding": "m",
        "title": "Clickable card",
        "description": "Entire card acts as one target.",
        "fill": "#ffffff",
        "stroke": "#d2d3d5",
        "selected": false
      },
      {
        "name": "type=selectable, variant=default, padding=m, selected=true",
        "padding": "m",
        "title": "Selectable card",
        "description": "Selected state with indicator.",
        "fill": "#ffffff",
        "stroke": "#39db1f",
        "selected": true
      },
      {
        "name": "type=card, variant=blue, padding=s, selected=false",
        "padding": "s",
        "title": "Tinted card",
        "description": "Category tint variant.",
        "fill": "#f0f7fe",
        "stroke": "#00000000",
        "selected": false
      }
    ]
  },
  {
    "id": "carousel",
    "template": "carousel",
    "name": "Carousel",
    "description": "Horizontal scrolling carousel generated from feature/badge-component.",
    "preview": {
      "stepY": 180
    },
    "component": {
      "width": 560,
      "height": 128
    },
    "item": {
      "width": 144,
      "height": 96,
      "radius": 8,
      "fill": "#ffffff",
      "stroke": "#e4e6e7",
      "layout": {
        "direction": "horizontal",
        "gap": 0,
        "primarySizing": "FIXED",
        "counterSizing": "FIXED",
        "primaryAlign": "CENTER",
        "counterAlign": "CENTER",
        "padding": {
          "top": 16,
          "right": 16,
          "bottom": 16,
          "left": 16
        }
      },
      "text": {
        "fontSize": 14,
        "lineHeight": 21,
        "color": "#1f2023"
      }
    },
    "variants": [
      {
        "name": "gap=s, buttons=true, edgeFade=true, snap=false",
        "gap": 8,
        "items": [
          "Item 1",
          "Item 2",
          "Item 3",
          "Item 4"
        ]
      },
      {
        "name": "gap=m, buttons=true, edgeFade=true, snap=true",
        "gap": 16,
        "items": [
          "Card 1",
          "Card 2",
          "Card 3",
          "Card 4"
        ]
      },
      {
        "name": "gap=none, buttons=false, edgeFade=false, snap=false",
        "gap": 0,
        "items": [
          "Tag",
          "Tag",
          "Tag",
          "Tag"
        ]
      }
    ]
  },
  {
    "id": "checkbox",
    "template": "checkbox",
    "name": "Checkbox",
    "description": {
      "fontSize": 12,
      "lineHeight": 18,
      "color": "#61646b"
    },
    "preview": {
      "stepY": 80
    },
    "component": {
      "layout": {
        "direction": "horizontal",
        "gap": 8,
        "primarySizing": "AUTO",
        "counterSizing": "AUTO",
        "primaryAlign": "MIN",
        "counterAlign": "MIN",
        "padding": {
          "top": 12,
          "right": 0,
          "bottom": 12,
          "left": 0
        }
      }
    },
    "box": {
      "size": 18,
      "radius": 4,
      "strokeWeight": 1.2
    },
    "copy": {
      "gap": 2
    },
    "label": {
      "fontSize": 14,
      "lineHeight": 21,
      "color": "#1f2023"
    },
    "variants": [
      {
        "name": "state=unchecked, error=false, disabled=false",
        "state": "unchecked",
        "label": "Receive notifications",
        "description": "Get product updates by email.",
        "boxFill": "#ffffff",
        "boxStroke": "#d2d3d5",
        "markColor": "#ffffff",
        "text": "#1f2023",
        "descriptionColor": "#61646b"
      },
      {
        "name": "state=checked, error=false, disabled=false",
        "state": "checked",
        "label": "Receive notifications",
        "description": "Get product updates by email.",
        "boxFill": "#2c2d30",
        "boxStroke": "#2c2d30",
        "markColor": "#ffffff",
        "text": "#1f2023",
        "descriptionColor": "#61646b"
      },
      {
        "name": "state=partial, error=false, disabled=false",
        "state": "partial",
        "label": "Select all",
        "description": "Some items are selected.",
        "boxFill": "#2c2d30",
        "boxStroke": "#2c2d30",
        "markColor": "#ffffff",
        "text": "#1f2023",
        "descriptionColor": "#61646b"
      },
      {
        "name": "state=unchecked, error=true, disabled=false",
        "state": "unchecked",
        "label": "Required agreement",
        "description": "This field is required.",
        "boxFill": "#ffffff",
        "boxStroke": "#ea3b2a",
        "markColor": "#ffffff",
        "text": "#1f2023",
        "descriptionColor": "#ea3b2a"
      }
    ]
  },
  {
    "id": "icon-button",
    "template": "icon-button",
    "name": "IconButton",
    "description": "Icon-only action button generated from feature/badge-component.",
    "preview": {
      "stepY": 72
    },
    "component": {
      "width": 48,
      "height": {
        "XL": 56,
        "L": 48,
        "M": 32,
        "S": 28
      },
      "strokeWeight": 1,
      "iconOnly": true,
      "layout": {
        "XL": {
          "direction": "horizontal",
          "gap": 0,
          "primarySizing": "FIXED",
          "counterSizing": "FIXED",
          "primaryAlign": "CENTER",
          "counterAlign": "CENTER",
          "padding": {
            "top": 16,
            "right": 16,
            "bottom": 16,
            "left": 16
          }
        },
        "L": {
          "direction": "horizontal",
          "gap": 0,
          "primarySizing": "FIXED",
          "counterSizing": "FIXED",
          "primaryAlign": "CENTER",
          "counterAlign": "CENTER",
          "padding": {
            "top": 12,
            "right": 12,
            "bottom": 12,
            "left": 12
          }
        },
        "M": {
          "direction": "horizontal",
          "gap": 0,
          "primarySizing": "FIXED",
          "counterSizing": "FIXED",
          "primaryAlign": "CENTER",
          "counterAlign": "CENTER",
          "padding": {
            "top": 6,
            "right": 6,
            "bottom": 6,
            "left": 6
          }
        },
        "S": {
          "direction": "horizontal",
          "gap": 0,
          "primarySizing": "FIXED",
          "counterSizing": "FIXED",
          "primaryAlign": "CENTER",
          "counterAlign": "CENTER",
          "padding": {
            "top": 6,
            "right": 6,
            "bottom": 6,
            "left": 6
          }
        }
      }
    },
    "text": {},
    "icon": {
      "XL": {
        "size": 24,
        "fontSize": 20,
        "lineHeight": 24
      },
      "L": {
        "size": 24,
        "fontSize": 20,
        "lineHeight": 24
      },
      "M": {
        "size": 20,
        "fontSize": 16,
        "lineHeight": 20
      },
      "S": {
        "size": 16,
        "fontSize": 14,
        "lineHeight": 16
      }
    },
    "variants": [
      {
        "name": "variant=primary, size=L, shape=circle",
        "size": "L",
        "label": "",
        "icon": "+",
        "radius": 9999,
        "fill": "#2c2d30",
        "stroke": "#00000000",
        "text": "#ffffff"
      },
      {
        "name": "variant=secondary, size=L, shape=circle",
        "size": "L",
        "label": "",
        "icon": ">",
        "radius": 9999,
        "fill": "#e4e6e7",
        "stroke": "#00000000",
        "text": "#1f2023"
      },
      {
        "name": "variant=tertiary, size=M, shape=square",
        "size": "M",
        "label": "",
        "icon": "x",
        "radius": 8,
        "fill": "#00000000",
        "stroke": "#e4e6e7",
        "text": "#1f2023"
      },
      {
        "name": "variant=assistive, size=S, shape=circle",
        "size": "S",
        "label": "",
        "icon": "i",
        "radius": 9999,
        "fill": "#00000000",
        "stroke": "#00000000",
        "text": "#3a3d40"
      }
    ]
  },
  {
    "id": "kbd",
    "template": "kbd",
    "name": "Kbd",
    "description": "Keyboard shortcut key badge. Generated on system/badge-component.",
    "component": {
      "minWidth": 24,
      "radius": 6,
      "strokeWeight": 1,
      "layout": {
        "direction": "horizontal",
        "gap": 0,
        "primarySizing": "AUTO",
        "counterSizing": "AUTO",
        "primaryAlign": "CENTER",
        "counterAlign": "CENTER",
        "padding": {
          "top": 2,
          "right": 4,
          "bottom": 2,
          "left": 4
        }
      },
      "fill": "#61646b",
      "stroke": "#d2d3d5"
    },
    "text": {
      "fontStyle": "Medium",
      "fontFamily": "mono",
      "fontSize": 12,
      "lineHeight": 18,
      "color": "#1f2023"
    },
    "variants": [
      {
        "name": "size=m",
        "size": "m",
        "text": "⌘"
      },
      {
        "name": "size=s",
        "size": "s",
        "text": "Esc"
      }
    ]
  },
  {
    "id": "lightbox",
    "template": "lightbox",
    "name": "Lightbox",
    "description": "Fullscreen media overlay (single/gallery). Generated on system/badge-component.",
    "component": {
      "fullscreen": true,
      "radius": 16,
      "layout": {
        "direction": "vertical",
        "gap": 16,
        "primarySizing": "FILL",
        "counterSizing": "FILL",
        "primaryAlign": "CENTER",
        "counterAlign": "CENTER",
        "padding": {
          "top": 24,
          "right": 24,
          "bottom": 24,
          "left": 24
        }
      },
      "backdrop": "#00000085"
    },
    "controls": {
      "closeButton": {
        "component": "IconButton",
        "position": "top-right"
      },
      "prevButton": {
        "component": "IconButton",
        "position": "left",
        "galleryOnly": true
      },
      "nextButton": {
        "component": "IconButton",
        "position": "right",
        "galleryOnly": true
      },
      "indexBadge": {
        "position": "bottom-center",
        "galleryOnly": true
      }
    },
    "variants": [
      {
        "name": "mode=single, type=image",
        "mode": "single",
        "itemType": "image"
      },
      {
        "name": "mode=gallery, type=image",
        "mode": "gallery",
        "itemType": "image",
        "enableZoom": true
      },
      {
        "name": "mode=single, type=video",
        "mode": "single",
        "itemType": "video"
      }
    ]
  },
  {
    "id": "linear-progress",
    "template": "linear-progress",
    "name": "LinearProgress",
    "description": "Single-task progress bar (determinate/indeterminate). Generated on system/badge-component.",
    "track": {
      "height": 4,
      "radius": 8,
      "fill": "#f5f5f5"
    },
    "fillColor": {
      "accent": "#39db1f",
      "success": "#17cf81",
      "warning": "#fc7a03",
      "error": "#ea3b2a"
    },
    "label": {
      "fontSize": 13,
      "color": "#3a3d40"
    },
    "variants": [
      {
        "name": "variant=accent, value=60",
        "variant": "accent",
        "value": 60
      },
      {
        "name": "variant=success, value=100",
        "variant": "success",
        "value": 100
      },
      {
        "name": "variant=accent, indeterminate",
        "variant": "accent",
        "value": null
      },
      {
        "name": "variant=error, value=30",
        "variant": "error",
        "value": 30
      }
    ]
  },
  {
    "id": "link",
    "template": "link",
    "name": "Link",
    "description": "Styled text navigation anchor. Generated on system/badge-component.",
    "component": {
      "layout": {
        "direction": "horizontal",
        "gap": 2,
        "primarySizing": "AUTO",
        "counterSizing": "AUTO",
        "primaryAlign": "CENTER",
        "counterAlign": "CENTER",
        "padding": {
          "top": 0,
          "right": 0,
          "bottom": 0,
          "left": 0
        }
      }
    },
    "text": {
      "fontStyle": "Regular",
      "fontSize": 16,
      "lineHeight": 24,
      "color": "#36cd1e"
    },
    "icon": {
      "name": "external",
      "size": 16,
      "color": "#36cd1e"
    },
    "variants": [
      {
        "name": "underline=hover, external=false",
        "underline": "hover",
        "isExternal": false,
        "text": "Inline link"
      },
      {
        "name": "underline=always, external=false",
        "underline": "always",
        "isExternal": false,
        "text": "Always underlined"
      },
      {
        "name": "underline=hover, external=true",
        "underline": "hover",
        "isExternal": true,
        "text": "External link"
      }
    ]
  },
  {
    "id": "list",
    "template": "list",
    "name": "List",
    "description": "Vertical collection of items with spacing, dividers, markers. Generated on system/badge-component.",
    "component": {
      "layout": {
        "direction": "vertical",
        "gap": 0,
        "primarySizing": "AUTO",
        "counterSizing": "FILL",
        "primaryAlign": "MIN",
        "counterAlign": "MIN",
        "padding": {
          "top": 0,
          "right": 0,
          "bottom": 0,
          "left": 0
        }
      },
      "divider": "#e4e6e7"
    },
    "item": {
      "layout": {
        "direction": "horizontal",
        "gap": 8,
        "primaryAlign": "MIN",
        "counterAlign": "CENTER",
        "padding": {
          "top": 8,
          "right": 16,
          "bottom": 8,
          "left": 16
        }
      },
      "label": {
        "fontSize": 16,
        "color": "#1f2023"
      },
      "description": {
        "fontSize": 13,
        "color": "#3a3d40"
      }
    },
    "variants": [
      {
        "name": "marker=none, dividers=false",
        "marker": "none",
        "hasDividers": false
      },
      {
        "name": "marker=disc, dividers=false",
        "marker": "disc",
        "hasDividers": false
      },
      {
        "name": "marker=decimal, dividers=false",
        "marker": "decimal",
        "hasDividers": false
      },
      {
        "name": "marker=none, dividers=true",
        "marker": "none",
        "hasDividers": true
      }
    ]
  },
  {
    "id": "more-menu",
    "template": "more-menu",
    "name": "MoreMenu",
    "description": "Three-dot overflow action menu. Generated on system/badge-component.",
    "trigger": {
      "component": "IconButton",
      "icon": "more-horizontal",
      "variant": "tertiary"
    },
    "menu": {
      "minWidth": 180,
      "radius": 16,
      "strokeWeight": 1,
      "fill": "#ffffff",
      "stroke": "#e4e6e7",
      "shadow": "0px 1px 3px 0px rgba(0, 0, 0, 0.09)",
      "layout": {
        "direction": "vertical",
        "gap": 0,
        "padding": {
          "top": 4,
          "right": 0,
          "bottom": 4,
          "left": 0
        }
      }
    },
    "item": {
      "layout": {
        "direction": "horizontal",
        "gap": 8,
        "padding": {
          "top": 6,
          "right": 16,
          "bottom": 6,
          "left": 16
        }
      },
      "label": {
        "fontSize": 13,
        "color": "#1f2023"
      },
      "dangerColor": "#ea3b2a"
    },
    "variants": [
      {
        "name": "type=items",
        "type": "items"
      },
      {
        "name": "type=dividers",
        "type": "dividers"
      },
      {
        "name": "type=sections",
        "type": "sections"
      }
    ]
  },
  {
    "id": "multi-selector",
    "template": "multi-selector",
    "name": "MultiSelector",
    "description": "Multi-select checkbox dropdown. Generated on system/badge-component.",
    "trigger": {
      "radius": 8,
      "strokeWeight": 1,
      "stroke": "#d2d3d5",
      "layout": {
        "direction": "horizontal",
        "gap": 8,
        "padding": {
          "top": 6,
          "right": 16,
          "bottom": 6,
          "left": 16
        }
      }
    },
    "list": {
      "radius": 16,
      "strokeWeight": 1,
      "fill": "#ffffff",
      "stroke": "#e4e6e7",
      "shadow": "0px 1px 3px 0px rgba(0, 0, 0, 0.09)"
    },
    "option": {
      "checkbox": true,
      "label": {
        "fontSize": 13,
        "color": "#1f2023"
      }
    },
    "badge": {
      "radius": 6,
      "fill": "#61646b"
    },
    "variants": [
      {
        "name": "display=count",
        "display": "count"
      },
      {
        "name": "display=badges",
        "display": "badges"
      },
      {
        "name": "searchable, select-all",
        "display": "count",
        "searchable": true,
        "selectAll": true
      },
      {
        "name": "sectioned",
        "display": "count",
        "sectioned": true
      }
    ]
  },
  {
    "id": "nav-tab",
    "name": "nav/tab",
    "description": "Large-scale navigation tabs generated from platform-system component spec.",
    "component": {
      "width": 1120,
      "height": 72,
      "fill": "#ffffff",
      "stroke": "#e4e6e7",
      "strokeWeight": 1,
      "layout": {
        "direction": "horizontal",
        "gap": 16,
        "primarySizing": "FIXED",
        "counterSizing": "AUTO",
        "primaryAlign": "MIN",
        "counterAlign": "CENTER",
        "padding": {
          "top": 12,
          "right": 0,
          "bottom": 12,
          "left": 0
        }
      }
    },
    "item": {
      "radius": 8,
      "layout": {
        "direction": "horizontal",
        "gap": 8,
        "primarySizing": "AUTO",
        "counterSizing": "AUTO",
        "primaryAlign": "CENTER",
        "counterAlign": "CENTER",
        "padding": {
          "top": 8,
          "right": 16,
          "bottom": 8,
          "left": 16
        }
      },
      "text": {
        "fontSize": 16,
        "lineHeight": 24,
        "color": "#61646b"
      },
      "states": {
        "default": {
          "fill": "#ffffff",
          "text": "#61646b"
        },
        "active": {
          "fill": "#f5f5f5",
          "text": "#1f2023"
        }
      }
    },
    "defaults": {
      "defaultCount": 3,
      "labels": [
        "Overview",
        "Components",
        "Guidelines",
        "Tokens",
        "Assets",
        "Release",
        "Archive"
      ]
    },
    "variants": [
      {
        "name": "product=bw, size=M, align=left, count=default",
        "count": "default"
      },
      {
        "name": "product=bw, size=M, align=left, count=3",
        "count": 3
      },
      {
        "name": "product=bw, size=M, align=left, count=4",
        "count": 4
      },
      {
        "name": "product=bw, size=M, align=left, count=5",
        "count": 5
      },
      {
        "name": "product=bw, size=M, align=left, count=6",
        "count": 6
      },
      {
        "name": "product=bw, size=M, align=left, count=7",
        "count": 7
      }
    ]
  },
  {
    "id": "number-input",
    "template": "number-input",
    "name": "NumberInput",
    "description": "Numeric input with min/max/step, unit, stepper, status. Generated on system/badge-component.",
    "component": {
      "field": {
        "radius": 8,
        "strokeWeight": 1,
        "layout": {
          "direction": "horizontal",
          "gap": 4,
          "primaryAlign": "MIN",
          "counterAlign": "CENTER",
          "padding": {
            "top": 6,
            "right": 16,
            "bottom": 6,
            "left": 16
          }
        }
      },
      "label": {
        "fontSize": 16,
        "color": "#3a3d40"
      },
      "unit": {
        "fontSize": 13,
        "color": "#3a3d40"
      }
    },
    "statusStroke": {
      "default": "#d2d3d5",
      "error": "#ea3b2a",
      "warning": "#fc7a03",
      "success": "#17cf81"
    },
    "variants": [
      {
        "name": "status=default",
        "status": "default",
        "unit": ""
      },
      {
        "name": "status=default, unit=%",
        "status": "default",
        "unit": "%"
      },
      {
        "name": "status=error",
        "status": "error",
        "unit": ""
      },
      {
        "name": "status=success",
        "status": "success",
        "unit": "GB"
      }
    ]
  },
  {
    "id": "pagination",
    "template": "pagination",
    "name": "Pagination",
    "description": "Page navigation (pages/count/compact/dots). Generated on system/badge-component.",
    "component": {
      "layout": {
        "direction": "horizontal",
        "gap": 4,
        "primaryAlign": "CENTER",
        "counterAlign": "CENTER"
      }
    },
    "pageButton": {
      "size": 32,
      "radius": 8,
      "font": {
        "fontSize": 13,
        "color": "#1f2023"
      },
      "currentFill": "#61646b"
    },
    "dot": {
      "size": 4,
      "radius": 9999,
      "activeFill": "#39db1f",
      "inactiveFill": "#61646b"
    },
    "variants": [
      {
        "name": "variant=pages",
        "variant": "pages"
      },
      {
        "name": "variant=count",
        "variant": "count"
      },
      {
        "name": "variant=compact",
        "variant": "compact"
      },
      {
        "name": "variant=dots",
        "variant": "dots"
      }
    ]
  },
  {
    "id": "popover",
    "template": "popover",
    "name": "Popover",
    "description": "Click-triggered anchored overlay panel. Generated on system/badge-component.",
    "panel": {
      "minWidth": 180,
      "radius": 16,
      "strokeWeight": 1,
      "fill": "#ffffff",
      "stroke": "#e4e6e7",
      "shadow": "0px 1px 3px 0px rgba(0, 0, 0, 0.09)",
      "layout": {
        "direction": "vertical",
        "gap": 8,
        "padding": {
          "top": 16,
          "right": 16,
          "bottom": 16,
          "left": 16
        }
      }
    },
    "closeButton": {
      "component": "IconButton",
      "variant": "tertiary",
      "position": "top-right"
    },
    "variants": [
      {
        "name": "placement=bottom",
        "placement": "bottom"
      },
      {
        "name": "placement=top",
        "placement": "top"
      },
      {
        "name": "placement=bottom, close=true",
        "placement": "bottom",
        "showCloseButton": true
      }
    ]
  },
  {
    "id": "radio-list",
    "template": "radio-list",
    "name": "RadioList",
    "description": "Single-select option group. Generated on system/badge-component.",
    "item": {
      "layout": {
        "direction": "horizontal",
        "gap": 8,
        "primaryAlign": "MIN",
        "counterAlign": "MIN",
        "padding": {
          "top": 8,
          "right": 16,
          "bottom": 8,
          "left": 16
        }
      },
      "radio": {
        "size": 20,
        "radius": 9999,
        "strokeWeight": 2,
        "uncheckedStroke": "#d2d3d5",
        "checkedStroke": "#39db1f",
        "dotFill": "#39db1f"
      },
      "label": {
        "fontSize": 16,
        "color": "#1f2023"
      },
      "description": {
        "fontSize": 13,
        "color": "#3a3d40"
      }
    },
    "variants": [
      {
        "name": "orientation=vertical",
        "orientation": "vertical"
      },
      {
        "name": "orientation=horizontal",
        "orientation": "horizontal"
      },
      {
        "name": "with-description",
        "orientation": "vertical",
        "hasDescription": true
      },
      {
        "name": "with-error",
        "orientation": "vertical",
        "hasError": true
      }
    ]
  },
  {
    "id": "segmented-control",
    "template": "segmented-control",
    "name": "SegmentedControl",
    "description": "Single-select segmented button group. Generated on system/badge-component.",
    "container": {
      "radius": 8,
      "fill": "#61646b",
      "layout": {
        "direction": "horizontal",
        "gap": 2,
        "padding": {
          "top": 2,
          "right": 2,
          "bottom": 2,
          "left": 2
        }
      }
    },
    "item": {
      "radius": 6,
      "layout": {
        "direction": "horizontal",
        "gap": 4,
        "padding": {
          "top": 4,
          "right": 16,
          "bottom": 4,
          "left": 16
        }
      },
      "label": {
        "fontSize": 13,
        "color": "#1f2023"
      },
      "selectedFill": "#ffffff",
      "selectedShadow": "0px 1px 5px 0px rgba(0, 0, 0, 0.5)"
    },
    "variants": [
      {
        "name": "layout=auto, content=label",
        "fill": false,
        "content": "label"
      },
      {
        "name": "layout=fill, content=label",
        "fill": true,
        "content": "label"
      },
      {
        "name": "content=icon+label",
        "fill": false,
        "content": "icon-label"
      },
      {
        "name": "content=icon-only",
        "fill": false,
        "content": "icon-only"
      }
    ]
  },
  {
    "id": "selector",
    "template": "selector",
    "name": "Selector",
    "description": "Single-select dropdown selector. Generated on system/badge-component.",
    "trigger": {
      "radius": 8,
      "strokeWeight": 1,
      "layout": {
        "direction": "horizontal",
        "gap": 8,
        "padding": {
          "top": 6,
          "right": 16,
          "bottom": 6,
          "left": 16
        }
      },
      "statusStroke": {
        "default": "#d2d3d5",
        "error": "#ea3b2a",
        "warning": "#fc7a03",
        "success": "#17cf81"
      }
    },
    "list": {
      "radius": 16,
      "strokeWeight": 1,
      "fill": "#ffffff",
      "stroke": "#e4e6e7",
      "shadow": "0px 1px 3px 0px rgba(0, 0, 0, 0.09)"
    },
    "option": {
      "label": {
        "fontSize": 13,
        "color": "#1f2023"
      }
    },
    "variants": [
      {
        "name": "status=default",
        "status": "default"
      },
      {
        "name": "status=default, clearable",
        "status": "default",
        "clearable": true
      },
      {
        "name": "sectioned",
        "status": "default",
        "sectioned": true
      },
      {
        "name": "status=error",
        "status": "error"
      }
    ]
  },
  {
    "id": "skeleton",
    "template": "skeleton",
    "name": "Skeleton",
    "description": "Animated shimmer loading placeholder. Generated on system/badge-component.",
    "component": {
      "fill": "#f5f5f5",
      "animation": "pulse"
    },
    "radius": {
      "text": 8,
      "rect": 8,
      "circle": 9999
    },
    "variants": [
      {
        "name": "variant=text",
        "variant": "text"
      },
      {
        "name": "variant=circle",
        "variant": "circle"
      },
      {
        "name": "variant=rect",
        "variant": "rect"
      }
    ]
  },
  {
    "id": "slider",
    "template": "slider",
    "name": "Slider",
    "description": "Draggable numeric/range selector with marks, validation. Generated on system/badge-component.",
    "track": {
      "height": 2,
      "radius": 9999,
      "fill": "#f5f5f5"
    },
    "fillColor": {
      "default": "#39db1f",
      "error": "#ea3b2a",
      "warning": "#fc7a03",
      "success": "#17cf81"
    },
    "thumb": {
      "size": 20,
      "radius": 9999,
      "fill": "#ffffff",
      "stroke": "#39db1f",
      "strokeWeight": 2,
      "shadow": "0px 1px 5px 0px rgba(0, 0, 0, 0.5)"
    },
    "mark": {
      "fontSize": 12,
      "color": "#3a3d40"
    },
    "variants": [
      {
        "name": "mode=single, status=default",
        "mode": "single",
        "status": "default"
      },
      {
        "name": "mode=range, status=default",
        "mode": "range",
        "status": "default"
      },
      {
        "name": "mode=single, marks",
        "mode": "single",
        "marks": true
      },
      {
        "name": "mode=single, status=error",
        "mode": "single",
        "status": "error"
      }
    ]
  },
  {
    "id": "spinner",
    "template": "spinner",
    "name": "Spinner",
    "description": "Indeterminate loading indicator with size, shade, and label variants.",
    "layout": {
      "direction": "vertical",
      "gap": 8,
      "primarySizing": "AUTO",
      "counterSizing": "AUTO",
      "primaryAlign": "CENTER",
      "counterAlign": "CENTER",
      "padding": {
        "top": 0,
        "right": 0,
        "bottom": 0,
        "left": 0
      }
    },
    "sizes": {
      "sm": {
        "frame": 16,
        "strokeWeight": 2
      },
      "md": {
        "frame": 20,
        "strokeWeight": 3
      },
      "lg": {
        "frame": 24,
        "strokeWeight": 3
      }
    },
    "shades": {
      "default": {
        "active": "#36cd1e",
        "track": "#a1a5aa"
      },
      "onMedia": {
        "active": "#ffffff",
        "track": "#d2d3d5"
      },
      "subtle": {
        "active": "#3a3d40",
        "track": "#a1a5aa"
      },
      "inherit": {
        "active": "#1f2023",
        "track": "#a1a5aa"
      }
    },
    "arc": {
      "start": -1.5707963267948966,
      "end": 3.141592653589793
    },
    "label": {
      "fontStyle": "SemiBold",
      "fontSize": 16,
      "lineHeight": 24,
      "color": "#1f2023"
    },
    "variants": [
      {
        "name": "size=sm, shade=default",
        "size": "sm",
        "shade": "default"
      },
      {
        "name": "size=md, shade=default",
        "size": "md",
        "shade": "default"
      },
      {
        "name": "size=lg, shade=default",
        "size": "lg",
        "shade": "default"
      },
      {
        "name": "size=sm, shade=onMedia",
        "size": "sm",
        "shade": "onMedia"
      },
      {
        "name": "size=md, shade=onMedia",
        "size": "md",
        "shade": "onMedia"
      },
      {
        "name": "size=lg, shade=onMedia",
        "size": "lg",
        "shade": "onMedia"
      },
      {
        "name": "size=sm, shade=subtle",
        "size": "sm",
        "shade": "subtle"
      },
      {
        "name": "size=md, shade=subtle",
        "size": "md",
        "shade": "subtle"
      },
      {
        "name": "size=lg, shade=subtle",
        "size": "lg",
        "shade": "subtle"
      },
      {
        "name": "size=sm, shade=inherit",
        "size": "sm",
        "shade": "inherit"
      },
      {
        "name": "size=md, shade=inherit",
        "size": "md",
        "shade": "inherit"
      },
      {
        "name": "size=lg, shade=inherit",
        "size": "lg",
        "shade": "inherit"
      },
      {
        "name": "size=lg, shade=default, label=true",
        "size": "lg",
        "shade": "default",
        "label": "로딩 중"
      }
    ]
  },
  {
    "id": "switch",
    "template": "switch",
    "name": "Switch",
    "description": {
      "fontStyle": "Regular",
      "fontSize": 12,
      "lineHeight": 18,
      "color": "#61646b"
    },
    "track": {
      "width": 40,
      "height": 24,
      "padding": 4,
      "radius": 9999,
      "offFill": "#61646b",
      "onFill": "#39db1f"
    },
    "thumb": {
      "offSize": 16,
      "onSize": 20,
      "radius": 9999,
      "fill": "#ffffff",
      "shadow": "0px 1px 5px 0px rgba(0, 0, 0, 0.5)"
    },
    "label": {
      "fontStyle": "Medium",
      "fontSize": 14,
      "lineHeight": 21,
      "color": "#1f2023"
    },
    "gap": 8,
    "variants": [
      {
        "name": "value=off",
        "value": false,
        "label": "알림 받기"
      },
      {
        "name": "value=on",
        "value": true,
        "label": "알림 받기"
      },
      {
        "name": "value=off, description",
        "value": false,
        "label": "다크 모드",
        "description": "어두운 화면으로 전환"
      },
      {
        "name": "value=on, loading",
        "value": true,
        "loading": true,
        "label": "동기화"
      },
      {
        "name": "value=off, disabled",
        "value": false,
        "disabled": true,
        "label": "프리미엄 기능"
      }
    ]
  },
  {
    "id": "tab",
    "template": "tab",
    "name": "Tab",
    "description": "Tab group containing Tab, TabList, and TabMenu patterns.",
    "sizes": {
      "sm": {
        "height": 28
      },
      "md": {
        "height": 32
      },
      "lg": {
        "height": 36
      }
    },
    "item": {
      "radius": 8,
      "gap": 4,
      "paddingX": 12,
      "fontSize": 14,
      "lineHeight": 21,
      "defaultColor": "#3a3d40",
      "selectedColor": "#1f2023",
      "hoverFill": "#f5f5f5"
    },
    "indicator": {
      "height": 2,
      "radius": 9999,
      "fill": "#39db1f"
    },
    "divider": {
      "height": 1,
      "fill": "#e4e6e7"
    },
    "menu": {
      "width": 180,
      "radius": 16,
      "fill": "#ffffff",
      "stroke": "#e4e6e7",
      "shadow": "0px 1px 3px 0px rgba(0, 0, 0, 0.09)"
    },
    "variants": [
      {
        "name": "Tab/size=sm, selected=false",
        "kind": "tab",
        "size": "sm",
        "selected": false,
        "label": "개요"
      },
      {
        "name": "Tab/size=md, selected=true",
        "kind": "tab",
        "size": "md",
        "selected": true,
        "label": "개요"
      },
      {
        "name": "Tab/size=lg, selected=false",
        "kind": "tab",
        "size": "lg",
        "selected": false,
        "label": "설정"
      },
      {
        "name": "TabList/layout=hug, divider=true",
        "kind": "list",
        "layout": "hug",
        "hasDivider": true
      },
      {
        "name": "TabList/layout=fill, divider=true",
        "kind": "list",
        "layout": "fill",
        "hasDivider": true
      },
      {
        "name": "TabMenu/state=closed",
        "kind": "menu",
        "open": false
      },
      {
        "name": "TabMenu/state=open",
        "kind": "menu",
        "open": true
      }
    ]
  },
  {
    "id": "text-area",
    "template": "text-area",
    "name": "TextArea",
    "description": "Controlled multiline text field with label, status, loading, and character count.",
    "field": {
      "width": 320,
      "height": 96,
      "radius": 8,
      "fill": "#ffffff",
      "stroke": "#e4e6e7",
      "focusStroke": "#39db1f",
      "padding": {
        "sm": 8,
        "md": 12,
        "lg": 16
      }
    },
    "statusStroke": {
      "error": "#ea3b2a",
      "warning": "#fc7a03",
      "success": "#17cf81"
    },
    "label": {
      "fontStyle": "Medium",
      "fontSize": 14,
      "lineHeight": 21,
      "color": "#1f2023"
    },
    "text": {
      "fontStyle": "Regular",
      "fontSize": 16,
      "lineHeight": 24,
      "color": "#1f2023",
      "placeholderColor": "#61646b"
    },
    "helper": {
      "fontStyle": "Regular",
      "fontSize": 12,
      "lineHeight": 18,
      "color": "#61646b"
    },
    "variants": [
      {
        "name": "size=sm, state=default",
        "size": "sm",
        "label": "설명",
        "placeholder": "내용을 입력하세요"
      },
      {
        "name": "size=md, state=default",
        "size": "md",
        "label": "설명",
        "placeholder": "내용을 입력하세요"
      },
      {
        "name": "size=lg, state=default",
        "size": "lg",
        "label": "설명",
        "placeholder": "내용을 입력하세요"
      },
      {
        "name": "size=md, state=error",
        "size": "md",
        "status": "error",
        "label": "설명",
        "value": "입력된 내용",
        "message": "내용을 확인하세요"
      },
      {
        "name": "size=md, state=warning",
        "size": "md",
        "status": "warning",
        "label": "설명",
        "value": "입력된 내용"
      },
      {
        "name": "size=md, state=success",
        "size": "md",
        "status": "success",
        "label": "설명",
        "value": "입력된 내용"
      },
      {
        "name": "size=md, counter=true",
        "size": "md",
        "label": "메시지",
        "value": "안녕하세요",
        "counter": "5/100"
      }
    ]
  },
  {
    "id": "thumbnail",
    "template": "thumbnail",
    "name": "Thumbnail",
    "description": "Fixed image preview with placeholder, loading, remove, and disabled states.",
    "frame": {
      "size": 64,
      "radius": 8,
      "fill": "#f5f5f5",
      "stroke": "#e4e6e7"
    },
    "icon": {
      "size": 24,
      "color": "#61646b"
    },
    "overlay": {
      "fill": "#00000085"
    },
    "remove": {
      "size": 20,
      "offset": 4,
      "radius": 8,
      "fill": "#ffffff",
      "color": "#3a3d40",
      "shadow": "0px 1px 5px 0px rgba(0, 0, 0, 0.5)"
    },
    "variants": [
      {
        "name": "state=placeholder",
        "state": "placeholder"
      },
      {
        "name": "state=image",
        "state": "image"
      },
      {
        "name": "state=image, removable=true",
        "state": "image",
        "removable": true
      },
      {
        "name": "state=loading, image=false",
        "state": "loading"
      },
      {
        "name": "state=loading, image=true",
        "state": "loading-image"
      },
      {
        "name": "state=disabled",
        "state": "image",
        "disabled": true
      }
    ]
  },
  {
    "id": "toggle-button",
    "template": "toggle-button",
    "name": "ToggleButton",
    "description": "Toggle button generated from feature/badge-component.",
    "preview": {
      "stepY": 72
    },
    "component": {
      "width": 112,
      "height": {
        "m": 36
      },
      "strokeWeight": 1,
      "iconOnly": false,
      "layout": {
        "m": {
          "direction": "horizontal",
          "gap": 4,
          "primarySizing": "FIXED",
          "counterSizing": "FIXED",
          "primaryAlign": "CENTER",
          "counterAlign": "CENTER",
          "padding": {
            "top": 8,
            "right": 16,
            "bottom": 8,
            "left": 16
          }
        }
      }
    },
    "text": {
      "m": {
        "fontSize": 13,
        "lineHeight": 20
      }
    },
    "icon": {
      "m": {
        "size": 14,
        "fontSize": 12,
        "lineHeight": 14
      }
    },
    "variants": [
      {
        "name": "pressed=false, size=m, icon=false",
        "size": "m",
        "label": "Unpressed",
        "pressed": false,
        "radius": 8,
        "fill": "#ffffff",
        "stroke": "#e4e6e7",
        "text": "#3a3d40"
      },
      {
        "name": "pressed=true, size=m, icon=false",
        "size": "m",
        "label": "Pressed",
        "pressed": true,
        "radius": 8,
        "fill": "#e4e6e7",
        "stroke": "#d2d3d5",
        "text": "#1f2023"
      },
      {
        "name": "pressed=true, size=m, icon=true",
        "size": "m",
        "label": "Bold",
        "icon": "B",
        "pressed": true,
        "radius": 8,
        "fill": "#e4e6e7",
        "stroke": "#d2d3d5",
        "text": "#1f2023"
      }
    ]
  }
];
let SPEC = SPECS[0];

const FONT_FAMILIES = ["Pretendard Variable", "Pretendard", "Inter", "Arial"];

async function loadFont(style = "Regular") {
  for (const family of FONT_FAMILIES) {
    const font = { family, style };
    try {
      await figma.loadFontAsync(font);
      return font;
    } catch (error) {
      if (style !== "Regular") {
        const regularFont = { family, style: "Regular" };
        try {
          await figma.loadFontAsync(regularFont);
          return regularFont;
        } catch (regularError) {
          // Try the next family.
        }
      }
    }
  }
  throw new Error("No supported font found.");
}

function hexToPaint(hex) {
  const value = String(hex || "#000000").replace("#", "");
  const r = parseInt(value.slice(0, 2), 16) / 255;
  const g = parseInt(value.slice(2, 4), 16) / 255;
  const b = parseInt(value.slice(4, 6), 16) / 255;
  const a = value.length === 8 ? parseInt(value.slice(6, 8), 16) / 255 : 1;
  return { type: "SOLID", color: { r, g, b }, opacity: a };
}

function applyAutoLayout(node, layout) {
  // Figma sizing enum은 FIXED/AUTO만 유효. 스펙의 FILL 등은 AUTO로 정규화.
  const normSizing = (v) => (v === "FIXED" || v === "AUTO") ? v : "AUTO";
  node.layoutMode = layout.direction === "vertical" ? "VERTICAL" : "HORIZONTAL";
  node.primaryAxisSizingMode = normSizing(layout.primarySizing);
  node.counterAxisSizingMode = normSizing(layout.counterSizing);
  node.itemSpacing = layout.gap || 0;
  node.paddingTop = layout.padding?.top || 0;
  node.paddingRight = layout.padding?.right || 0;
  node.paddingBottom = layout.padding?.bottom || 0;
  node.paddingLeft = layout.padding?.left || 0;
  node.primaryAxisAlignItems = layout.primaryAlign || "MIN";
  node.counterAxisAlignItems = layout.counterAlign || "CENTER";
}

function createLabel(text, fontName, style) {
  const node = figma.createText();
  node.name = "label";
  node.fontName = fontName;
  node.characters = text;
  node.fontSize = style.fontSize;
  node.lineHeight = { unit: "PIXELS", value: style.lineHeight };
  node.fills = [hexToPaint(style.color)];
  return node;
}

function createBadgeIcon(style) {
  const node = figma.createEllipse();
  node.name = "icon";
  node.resize(style.size, style.size);
  node.fills = [hexToPaint(style.color)];
  return node;
}

function createSymbol(text, fontName, style) {
  const node = createLabel(text, fontName, style);
  node.name = "icon";
  node.textAlignHorizontal = "CENTER";
  node.textAlignVertical = "CENTER";
  node.resize(style.size, style.size);
  return node;
}

function createTabItem(label, state, fontName, spec) {
  const item = figma.createFrame();
  item.name = "tab-item / " + state;
  applyAutoLayout(item, spec.item.layout);
  item.cornerRadius = spec.item.radius;
  item.fills = [hexToPaint(spec.item.states[state].fill)];

  const text = createLabel(label, fontName, {
    ...spec.item.text,
    color: spec.item.states[state].text,
  });
  item.appendChild(text);
  return item;
}

function createNavTabVariant(variantSpec, fontName) {
  const component = figma.createComponent();
  component.name = variantSpec.name;
  component.resize(SPEC.component.width, SPEC.component.height);
  applyAutoLayout(component, SPEC.component.layout);
  component.fills = [hexToPaint(SPEC.component.fill)];
  component.strokes = [hexToPaint(SPEC.component.stroke)];
  component.strokeWeight = SPEC.component.strokeWeight;

  const count = variantSpec.count === "default" ? SPEC.defaults.defaultCount : Number(variantSpec.count);
  for (let index = 0; index < count; index += 1) {
    const label = SPEC.defaults.labels[index] || "Tab " + (index + 1);
    const state = index === 0 ? "active" : "default";
    component.appendChild(createTabItem(label, state, fontName, SPEC));
  }
  return component;
}

function createBadgeVariant(variantSpec, fontName) {
  const component = figma.createComponent();
  component.name = variantSpec.name;
  component.resize(SPEC.component.minWidth, SPEC.component.height);
  applyAutoLayout(component, SPEC.component.layout);
  component.cornerRadius = SPEC.component.radius;
  component.fills = [hexToPaint(variantSpec.fill)];

  if (variantSpec.icon) {
    component.appendChild(createBadgeIcon({
      size: SPEC.icon.size,
      color: variantSpec.text,
    }));
  }

  component.appendChild(createLabel(variantSpec.label, fontName, {
    ...SPEC.text,
    color: variantSpec.text,
  }));
  return component;
}

function createBannerVariant(variantSpec, fontName) {
  const component = figma.createComponent();
  component.name = variantSpec.name;
  component.resize(SPEC.component.width, SPEC.component.minHeight);
  component.layoutMode = "VERTICAL";
  component.primaryAxisSizingMode = "AUTO";
  component.counterAxisSizingMode = "FIXED";
  component.itemSpacing = 0;
  component.fills = [];

  const header = figma.createFrame();
  header.name = "header";
  header.resize(SPEC.component.width, SPEC.header.minHeight);
  applyAutoLayout(header, SPEC.header.layout);
  header.fills = [hexToPaint(variantSpec.fill)];
  header.cornerRadius = variantSpec.container === "card" && !variantSpec.expanded ? SPEC.component.radius : 0;
  if (variantSpec.container === "card" && variantSpec.expanded) {
    header.topLeftRadius = SPEC.component.radius;
    header.topRightRadius = SPEC.component.radius;
    header.bottomLeftRadius = 0;
    header.bottomRightRadius = 0;
  }

  header.appendChild(createSymbol(variantSpec.icon, fontName, {
    ...SPEC.icon,
    color: variantSpec.iconColor,
  }));

  const copy = figma.createFrame();
  copy.name = "copy";
  copy.layoutMode = "VERTICAL";
  copy.primaryAxisSizingMode = "AUTO";
  copy.counterAxisSizingMode = "FIXED";
  copy.resize(SPEC.copy.width, SPEC.header.minHeight);
  copy.itemSpacing = SPEC.copy.gap;
  copy.fills = [];
  copy.layoutGrow = 1;

  copy.appendChild(createLabel(variantSpec.title, fontName, {
    ...SPEC.title,
    color: SPEC.title.color,
  }));

  if (variantSpec.description) {
    copy.appendChild(createLabel(variantSpec.description, fontName, {
      ...SPEC.description,
      color: SPEC.description.color,
    }));
  }
  header.appendChild(copy);

  const actions = figma.createFrame();
  actions.name = "actions";
  actions.layoutMode = "HORIZONTAL";
  actions.primaryAxisSizingMode = "AUTO";
  actions.counterAxisSizingMode = "AUTO";
  actions.counterAxisAlignItems = "CENTER";
  actions.itemSpacing = SPEC.actions.gap;
  actions.fills = [];

  if (variantSpec.expanded) {
    actions.appendChild(createSymbol("^", fontName, SPEC.actionIcon));
  }
  if (variantSpec.dismissable) {
    actions.appendChild(createSymbol("x", fontName, SPEC.actionIcon));
  }
  if (variantSpec.expanded || variantSpec.dismissable) {
    header.appendChild(actions);
  }

  component.appendChild(header);

  if (variantSpec.expanded) {
    const content = figma.createFrame();
    content.name = "content";
    content.resize(SPEC.component.width, SPEC.content.minHeight);
    applyAutoLayout(content, SPEC.content.layout);
    content.fills = [hexToPaint(SPEC.content.fill)];
    content.strokes = [hexToPaint(SPEC.content.stroke)];
    content.strokeWeight = SPEC.content.strokeWeight;
    if (variantSpec.container === "card") {
      content.topLeftRadius = 0;
      content.topRightRadius = 0;
      content.bottomLeftRadius = SPEC.component.radius;
      content.bottomRightRadius = SPEC.component.radius;
    }
    content.appendChild(createLabel(SPEC.content.label, fontName, {
      ...SPEC.description,
      color: SPEC.description.color,
    }));
    component.appendChild(content);
  }

  return component;
}

function createBreadcrumbItem(label, index, total, variantSpec, fontName) {
  const item = figma.createFrame();
  item.name = index === total - 1 ? "item / current" : "item / link";
  applyAutoLayout(item, SPEC.item.layout);
  item.fills = [];

  if (index > 0) {
    item.appendChild(createLabel(variantSpec.separator, fontName, {
      ...SPEC.text[variantSpec.variant],
      color: SPEC.separator.color,
    }));
  }

  const isCurrent = index === total - 1;
  item.appendChild(createLabel(label, fontName, {
    ...SPEC.text[variantSpec.variant],
    color: isCurrent ? variantSpec.currentColor : variantSpec.linkColor,
  }));

  return item;
}

function createBreadcrumbsVariant(variantSpec, fontName) {
  const component = figma.createComponent();
  component.name = variantSpec.name;
  applyAutoLayout(component, SPEC.component.layout);
  component.fills = [];

  variantSpec.items.forEach((label, index) => {
    component.appendChild(createBreadcrumbItem(label, index, variantSpec.items.length, variantSpec, fontName));
  });

  return component;
}

function createButtonPrimitive(buttonSpec, index, total, groupSpec, fontName) {
  const button = figma.createFrame();
  button.name = "button / " + buttonSpec.label;
  button.resize(SPEC.button.width, SPEC.button.height[groupSpec.size]);
  applyAutoLayout(button, SPEC.button.layout[groupSpec.size]);
  button.fills = [hexToPaint(groupSpec.fill)];
  button.strokes = [hexToPaint(groupSpec.stroke)];
  button.strokeWeight = SPEC.button.strokeWeight;

  if (groupSpec.orientation === "horizontal") {
    button.topLeftRadius = index === 0 ? groupSpec.radius : 0;
    button.bottomLeftRadius = index === 0 ? groupSpec.radius : 0;
    button.topRightRadius = index === total - 1 ? groupSpec.radius : 0;
    button.bottomRightRadius = index === total - 1 ? groupSpec.radius : 0;
  } else {
    button.topLeftRadius = index === 0 ? groupSpec.radius : 0;
    button.topRightRadius = index === 0 ? groupSpec.radius : 0;
    button.bottomLeftRadius = index === total - 1 ? groupSpec.radius : 0;
    button.bottomRightRadius = index === total - 1 ? groupSpec.radius : 0;
  }

  button.appendChild(createLabel(buttonSpec.label, fontName, {
    ...SPEC.button.text[groupSpec.size],
    color: groupSpec.text,
  }));
  return button;
}

function createButtonGroupVariant(variantSpec, fontName) {
  const component = figma.createComponent();
  component.name = variantSpec.name;
  component.layoutMode = variantSpec.orientation === "vertical" ? "VERTICAL" : "HORIZONTAL";
  component.primaryAxisSizingMode = "AUTO";
  component.counterAxisSizingMode = "AUTO";
  component.itemSpacing = -SPEC.button.strokeWeight;
  component.fills = [];

  variantSpec.items.forEach((buttonSpec, index) => {
    component.appendChild(createButtonPrimitive(buttonSpec, index, variantSpec.items.length, variantSpec, fontName));
  });

  return component;
}

function createSimpleButtonVariant(variantSpec, fontName) {
  const component = figma.createComponent();
  component.name = variantSpec.name;
  component.resize(variantSpec.width || SPEC.component.width, SPEC.component.height[variantSpec.size]);
  applyAutoLayout(component, SPEC.component.layout[variantSpec.size]);
  component.cornerRadius = variantSpec.radius;
  component.fills = [hexToPaint(variantSpec.fill)];
  component.strokes = [hexToPaint(variantSpec.stroke)];
  component.strokeWeight = SPEC.component.strokeWeight;

  if (variantSpec.icon) {
    component.appendChild(createSymbol(variantSpec.icon, fontName, {
      ...SPEC.icon[variantSpec.size],
      color: variantSpec.text,
    }));
  }

  if (!SPEC.component.iconOnly) {
    component.appendChild(createLabel(variantSpec.label, fontName, {
      ...SPEC.text[variantSpec.size],
      color: variantSpec.text,
    }));
  }
  return component;
}

function createToggleButtonVariant(variantSpec, fontName) {
  const component = createSimpleButtonVariant(variantSpec, fontName);
  if (variantSpec.pressed) {
    component.name = variantSpec.name;
  }
  return component;
}

function createCheckboxMark(variantSpec, fontName) {
  const box = figma.createFrame();
  box.name = "checkbox";
  box.resize(SPEC.box.size, SPEC.box.size);
  box.cornerRadius = SPEC.box.radius;
  box.fills = [hexToPaint(variantSpec.boxFill)];
  box.strokes = [hexToPaint(variantSpec.boxStroke)];
  box.strokeWeight = SPEC.box.strokeWeight;
  if (variantSpec.state === "checked" || variantSpec.state === "partial") {
    const mark = figma.createText();
    mark.name = "mark";
    mark.fontName = fontName;
    mark.characters = variantSpec.state === "partial" ? "-" : "v";
    mark.fontSize = 12;
    mark.lineHeight = { unit: "PIXELS", value: 12 };
    mark.fills = [hexToPaint(variantSpec.markColor)];
    box.appendChild(mark);
  }
  return box;
}

function createCheckboxVariant(variantSpec, fontName) {
  const component = figma.createComponent();
  component.name = variantSpec.name;
  applyAutoLayout(component, SPEC.component.layout);
  component.fills = [];
  component.appendChild(createCheckboxMark(variantSpec, fontName));

  const copy = figma.createFrame();
  copy.name = "copy";
  copy.layoutMode = "VERTICAL";
  copy.primaryAxisSizingMode = "AUTO";
  copy.counterAxisSizingMode = "AUTO";
  copy.itemSpacing = SPEC.copy.gap;
  copy.fills = [];
  copy.appendChild(createLabel(variantSpec.label, fontName, {
    ...SPEC.label,
    color: variantSpec.text,
  }));
  if (variantSpec.description) {
    copy.appendChild(createLabel(variantSpec.description, fontName, {
      ...SPEC.description,
      color: variantSpec.descriptionColor,
    }));
  }
  component.appendChild(copy);
  return component;
}

function createCardVariant(variantSpec, fontName) {
  const component = figma.createComponent();
  component.name = variantSpec.name;
  component.resize(SPEC.component.width, SPEC.component.height);
  applyAutoLayout(component, SPEC.component.layout[variantSpec.padding]);
  component.cornerRadius = SPEC.component.radius;
  component.fills = [hexToPaint(variantSpec.fill)];
  component.strokes = [hexToPaint(variantSpec.stroke)];
  component.strokeWeight = SPEC.component.strokeWeight;

  component.appendChild(createLabel(variantSpec.title, fontName, {
    ...SPEC.title,
    color: SPEC.title.color,
  }));
  component.appendChild(createLabel(variantSpec.description, fontName, {
    ...SPEC.description,
    color: SPEC.description.color,
  }));

  if (variantSpec.selected) {
    const indicator = createBadgeIcon({
      size: SPEC.indicator.size,
      color: SPEC.indicator.fill,
    });
    indicator.name = "selected-indicator";
    component.appendChild(indicator);
  }
  return component;
}

function createCarouselVariant(variantSpec, fontName) {
  const component = figma.createComponent();
  component.name = variantSpec.name;
  component.resize(SPEC.component.width, SPEC.component.height);
  component.layoutMode = "HORIZONTAL";
  component.primaryAxisSizingMode = "FIXED";
  component.counterAxisSizingMode = "FIXED";
  component.counterAxisAlignItems = "CENTER";
  component.itemSpacing = variantSpec.gap;
  component.fills = [];

  variantSpec.items.forEach((label) => {
    const item = figma.createFrame();
    item.name = "item";
    item.resize(SPEC.item.width, SPEC.item.height);
    applyAutoLayout(item, SPEC.item.layout);
    item.cornerRadius = SPEC.item.radius;
    item.fills = [hexToPaint(SPEC.item.fill)];
    item.strokes = [hexToPaint(SPEC.item.stroke)];
    item.strokeWeight = 1;
    item.appendChild(createLabel(label, fontName, SPEC.item.text));
    component.appendChild(item);
  });

  return component;
}

function createCalendarCell(day, state, fontName) {
  const cell = figma.createFrame();
  cell.name = "day / " + state;
  cell.resize(SPEC.cell.size, SPEC.cell.size);
  applyAutoLayout(cell, SPEC.cell.layout);
  cell.cornerRadius = state === "in-range" ? 0 : SPEC.cell.radius;
  cell.fills = [hexToPaint(SPEC.cell.states[state].fill)];
  cell.strokes = SPEC.cell.states[state].stroke ? [hexToPaint(SPEC.cell.states[state].stroke)] : [];
  cell.strokeWeight = SPEC.cell.states[state].stroke ? 1 : 0;
  cell.appendChild(createLabel(String(day), fontName, {
    ...SPEC.cell.text,
    color: SPEC.cell.states[state].text,
  }));
  return cell;
}

function createCalendarVariant(variantSpec, fontName) {
  const component = figma.createComponent();
  component.name = variantSpec.name;
  component.resize(SPEC.component.width, SPEC.component.height);
  component.layoutMode = "VERTICAL";
  component.primaryAxisSizingMode = "FIXED";
  component.counterAxisSizingMode = "FIXED";
  component.itemSpacing = SPEC.component.gap;
  component.fills = [hexToPaint(SPEC.component.fill)];

  const header = figma.createFrame();
  header.name = "month";
  applyAutoLayout(header, SPEC.header.layout);
  header.fills = [];
  header.appendChild(createSymbol("<", fontName, SPEC.header.icon));
  header.appendChild(createLabel(variantSpec.month, fontName, SPEC.header.text));
  header.appendChild(createSymbol(">", fontName, SPEC.header.icon));
  component.appendChild(header);

  const weekdays = figma.createFrame();
  weekdays.name = "weekdays";
  weekdays.layoutMode = "HORIZONTAL";
  weekdays.primaryAxisSizingMode = "AUTO";
  weekdays.counterAxisSizingMode = "AUTO";
  weekdays.itemSpacing = 0;
  weekdays.fills = [];
  SPEC.weekdays.forEach((day) => weekdays.appendChild(createLabel(day, fontName, SPEC.weekdayText)));
  component.appendChild(weekdays);

  const grid = figma.createFrame();
  grid.name = "grid";
  grid.layoutMode = "VERTICAL";
  grid.primaryAxisSizingMode = "AUTO";
  grid.counterAxisSizingMode = "AUTO";
  grid.itemSpacing = 0;
  grid.fills = [];
  for (let rowIndex = 0; rowIndex < 6; rowIndex += 1) {
    const row = figma.createFrame();
    row.name = "week";
    row.layoutMode = "HORIZONTAL";
    row.primaryAxisSizingMode = "AUTO";
    row.counterAxisSizingMode = "AUTO";
    row.itemSpacing = 0;
    row.fills = [];
    for (let colIndex = 0; colIndex < 7; colIndex += 1) {
      const day = rowIndex * 7 + colIndex - 1;
      let state = "default";
      if (variantSpec.mode === "range" && day >= 10 && day <= 15) state = "in-range";
      if (day === 12 || (variantSpec.mode === "range" && day === 15)) state = "selected";
      if (day < 1 || day > 31) state = "outside";
      row.appendChild(createCalendarCell(day < 1 ? "" : day > 31 ? "" : day, state, fontName));
    }
    grid.appendChild(row);
  }
  component.appendChild(grid);
  return component;
}

function createVariant(variantSpec, fontName) {
  if (SPEC.template === "calendar") {
    return createCalendarVariant(variantSpec, fontName);
  }
  if (SPEC.template === "carousel") {
    return createCarouselVariant(variantSpec, fontName);
  }
  if (SPEC.template === "card") {
    return createCardVariant(variantSpec, fontName);
  }
  if (SPEC.template === "checkbox") {
    return createCheckboxVariant(variantSpec, fontName);
  }
  if (SPEC.template === "toggle-button") {
    return createToggleButtonVariant(variantSpec, fontName);
  }
  if (SPEC.template === "button" || SPEC.template === "icon-button") {
    return createSimpleButtonVariant(variantSpec, fontName);
  }
  if (SPEC.template === "button-group") {
    return createButtonGroupVariant(variantSpec, fontName);
  }
  if (SPEC.template === "breadcrumbs") {
    return createBreadcrumbsVariant(variantSpec, fontName);
  }
  if (SPEC.template === "banner") {
    return createBannerVariant(variantSpec, fontName);
  }
  if (SPEC.template === "badge") {
    return createBadgeVariant(variantSpec, fontName);
  }
  if (SPEC.template === "nav-tab") {
    return createNavTabVariant(variantSpec, fontName);
  }
  const NEW_RENDERERS = {
    "kbd": createKbdVariant,
    "link": createLinkVariant,
    "list": createListVariant,
    "skeleton": createSkeletonVariant,
    "linear-progress": createLinearProgressVariant,
    "segmented-control": createSegmentedControlVariant,
    "radio-list": createRadioListVariant,
    "slider": createSliderVariant,
    "pagination": createPaginationVariant,
    "number-input": createNumberInputVariant,
    "selector": createSelectorVariant,
    "multi-selector": createMultiSelectorVariant,
    "popover": createPopoverVariant,
    "more-menu": createMoreMenuVariant,
    "lightbox": createLightboxVariant,
    "spinner": createSpinnerVariant,
    "switch": createSwitchVariant,
    "tab": createTabVariant,
    "text-area": createTextAreaVariant,
    "thumbnail": createThumbnailVariant,
  };
  const renderer = NEW_RENDERERS[SPEC.template];
  if (renderer) {
    return renderer(variantSpec, fontName);
  }
  return createGenericVariant(variantSpec, fontName);
}

/* ─────────────────────────────────────────────
   신규 컴포넌트 전용 렌더러 (스펙 구조 반영)
   공통 헬퍼: hexToPaint, applyAutoLayout, createLabel
   ───────────────────────────────────────────── */

function frameBox(name, { layout, radius, fill, stroke, strokeWeight } = {}) {
  const node = figma.createFrame();
  node.name = name;
  if (layout) applyAutoLayout(node, layout);
  else {
    node.layoutMode = "HORIZONTAL";
    node.primaryAxisSizingMode = "AUTO";
    node.counterAxisSizingMode = "AUTO";
  }
  if (typeof radius === "number") node.cornerRadius = radius;
  node.fills = fill ? [hexToPaint(fill)] : [];
  if (stroke) { node.strokes = [hexToPaint(stroke)]; node.strokeWeight = strokeWeight || 1; }
  return node;
}

function txt(text, fontName, size, color) {
  const n = figma.createText();
  n.fontName = fontName;
  n.characters = String(text);
  n.fontSize = size || 13;
  n.fills = [hexToPaint(color || "#1F2023")];
  return n;
}

// Kbd — 키 배지
function createKbdVariant(variantSpec, fontName) {
  const c = figma.createComponent();
  c.name = variantSpec.name;
  applyAutoLayout(c, SPEC.component.layout);
  c.cornerRadius = SPEC.component.radius;
  c.fills = [hexToPaint(SPEC.component.fill)];
  c.strokes = [hexToPaint(SPEC.component.stroke)];
  c.strokeWeight = SPEC.component.strokeWeight || 1;
  c.appendChild(txt(variantSpec.text || "⌘", fontName, SPEC.text.fontSize, SPEC.text.color));
  return c;
}

// Link — 텍스트 앵커 (+ 외부 아이콘)
function createLinkVariant(variantSpec, fontName) {
  const c = figma.createComponent();
  c.name = variantSpec.name;
  applyAutoLayout(c, SPEC.component.layout);
  c.fills = [];
  const label = txt(variantSpec.text || "Link", fontName, SPEC.text.fontSize, SPEC.text.color);
  c.appendChild(label);
  if (variantSpec.isExternal && SPEC.icon) {
    const ico = figma.createFrame();
    ico.name = "external-icon";
    ico.resize(SPEC.icon.size, SPEC.icon.size);
    ico.fills = [hexToPaint(SPEC.icon.color)];
    ico.cornerRadius = 2;
    c.appendChild(ico);
  }
  return c;
}

// List — 항목 세로 스택
function createListVariant(variantSpec, fontName) {
  const c = figma.createComponent();
  c.name = variantSpec.name;
  applyAutoLayout(c, SPEC.component.layout);
  c.fills = [];
  c.primaryAxisSizingMode = "AUTO";
  c.counterAxisSizingMode = "FIXED";
  c.resize(320, Math.max(c.height, 1));
  const labels = ["첫 번째 항목", "두 번째 항목", "세 번째 항목"];
  labels.forEach((t, i) => {
    const item = frameBox("item", { layout: SPEC.item.layout });
    item.layoutAlign = "STRETCH";
    if (variantSpec.hasDividers && i > 0 && SPEC.component.divider) {
      item.strokes = [hexToPaint(SPEC.component.divider)];
      item.strokeWeight = 1;
      item.strokeTopWeight = 1;
      item.strokeBottomWeight = 0; item.strokeLeftWeight = 0; item.strokeRightWeight = 0;
    }
    const prefix = variantSpec.marker === "disc" ? "• " : variantSpec.marker === "decimal" ? (i + 1) + ". " : "";
    item.appendChild(txt(prefix + t, fontName, SPEC.item.label.fontSize, SPEC.item.label.color));
    c.appendChild(item);
  });
  return c;
}

// Skeleton — 시머 박스
function createSkeletonVariant(variantSpec, fontName) {
  const c = figma.createComponent();
  c.name = variantSpec.name;
  c.fills = [hexToPaint(SPEC.component.fill)];
  const v = variantSpec.variant || "text";
  if (v === "circle") { c.resize(40, 40); c.cornerRadius = 9999; }
  else if (v === "rect") { c.resize(160, 90); c.cornerRadius = SPEC.radius.rect; }
  else { c.resize(200, 12); c.cornerRadius = SPEC.radius.text; }
  return c;
}

// Spinner — 트랙 + 75% 활성 아크
function createSpinnerVariant(variantSpec, fontName) {
  const c = figma.createComponent();
  c.name = variantSpec.name;
  applyAutoLayout(c, SPEC.layout);
  c.fills = [];

  const size = SPEC.sizes[variantSpec.size || "md"];
  const shade = SPEC.shades[variantSpec.shade || "default"];
  const ring = figma.createFrame();
  ring.name = "ring";
  ring.layoutMode = "NONE";
  ring.resize(size.frame, size.frame);
  ring.fills = [];

  const inset = size.strokeWeight / 2;
  const diameter = size.frame - size.strokeWeight;

  const track = figma.createEllipse();
  track.name = "track";
  track.resize(diameter, diameter);
  track.x = inset;
  track.y = inset;
  track.fills = [];
  track.strokes = [hexToPaint(shade.track)];
  track.strokeWeight = size.strokeWeight;
  ring.appendChild(track);

  const active = figma.createEllipse();
  active.name = "active-arc";
  active.resize(diameter, diameter);
  active.x = inset;
  active.y = inset;
  active.fills = [];
  active.strokes = [hexToPaint(shade.active)];
  active.strokeWeight = size.strokeWeight;
  active.strokeCap = "ROUND";
  active.arcData = {
    startingAngle: SPEC.arc.start,
    endingAngle: SPEC.arc.end,
    innerRadius: 0,
  };
  ring.appendChild(active);
  c.appendChild(ring);

  if (variantSpec.label) {
    c.appendChild(createLabel(variantSpec.label, fontName, SPEC.label));
  }

  return c;
}

// Switch — fixed track, adaptive thumb, and optional copy
function createSwitchVariant(variantSpec, fontName) {
  const c = figma.createComponent();
  c.name = variantSpec.name;
  c.layoutMode = "HORIZONTAL";
  c.primaryAxisSizingMode = "AUTO";
  c.counterAxisSizingMode = "AUTO";
  c.counterAxisAlignItems = "CENTER";
  c.itemSpacing = SPEC.gap;
  c.fills = [];

  const track = figma.createFrame();
  track.name = "track";
  track.layoutMode = "NONE";
  track.resize(SPEC.track.width, SPEC.track.height);
  track.cornerRadius = SPEC.track.radius;
  track.fills = [hexToPaint(variantSpec.value ? SPEC.track.onFill : SPEC.track.offFill)];

  const thumbSize = variantSpec.value ? SPEC.thumb.onSize : SPEC.thumb.offSize;
  const thumb = figma.createEllipse();
  thumb.name = variantSpec.loading ? "thumb / loading" : "thumb";
  thumb.resize(thumbSize, thumbSize);
  thumb.x = variantSpec.value
    ? SPEC.track.width - SPEC.track.padding - thumbSize
    : SPEC.track.padding;
  thumb.y = (SPEC.track.height - thumbSize) / 2;
  thumb.fills = [hexToPaint(SPEC.thumb.fill)];
  track.appendChild(thumb);
  c.appendChild(track);

  const copy = frameBox("copy", {
    layout: {
      direction: "vertical",
      gap: variantSpec.description ? 2 : 0,
      primarySizing: "AUTO",
      counterSizing: "AUTO",
      padding: {},
    },
  });
  copy.fills = [];
  copy.appendChild(createLabel(variantSpec.label || "Switch", fontName, SPEC.label));
  if (variantSpec.description) {
    copy.appendChild(createLabel(variantSpec.description, fontName, SPEC.description));
  }
  c.appendChild(copy);
  if (variantSpec.disabled) c.opacity = 0.5;
  return c;
}

// Tab family — Tab, TabList, and TabMenu share one component set
function createTabVariant(variantSpec, fontName) {
  const c = figma.createComponent();
  c.name = variantSpec.name;
  c.fills = [];

  const makeItem = (label, selected, size) => {
    const item = frameBox("tab / " + label);
    item.layoutMode = "HORIZONTAL";
    item.primaryAxisSizingMode = "AUTO";
    item.counterAxisSizingMode = "FIXED";
    item.counterAxisAlignItems = "CENTER";
    item.primaryAxisAlignItems = "CENTER";
    item.itemSpacing = SPEC.item.gap;
    item.paddingLeft = SPEC.item.paddingX;
    item.paddingRight = SPEC.item.paddingX;
    item.resize(72, SPEC.sizes[size || "md"].height);
    item.cornerRadius = SPEC.item.radius;
    item.fills = [];
    item.appendChild(txt(label, fontName, SPEC.item.fontSize, selected ? SPEC.item.selectedColor : SPEC.item.defaultColor));
    if (selected) {
      const indicator = figma.createFrame();
      indicator.name = "indicator";
      indicator.resize(48, SPEC.indicator.height);
      indicator.cornerRadius = SPEC.indicator.radius;
      indicator.fills = [hexToPaint(SPEC.indicator.fill)];
      indicator.layoutPositioning = "ABSOLUTE";
      indicator.x = 12;
      indicator.y = SPEC.sizes[size || "md"].height - SPEC.indicator.height;
      item.appendChild(indicator);
    }
    return item;
  };

  if (variantSpec.kind === "tab") {
    const item = makeItem(variantSpec.label || "Tab", variantSpec.selected, variantSpec.size);
    c.resize(item.width, item.height);
    c.layoutMode = "HORIZONTAL";
    c.primaryAxisSizingMode = "AUTO";
    c.counterAxisSizingMode = "AUTO";
    c.appendChild(item);
    return c;
  }

  if (variantSpec.kind === "list") {
    c.layoutMode = "HORIZONTAL";
    c.primaryAxisSizingMode = variantSpec.layout === "fill" ? "FIXED" : "AUTO";
    c.counterAxisSizingMode = "AUTO";
    c.itemSpacing = 2;
    if (variantSpec.layout === "fill") c.resize(320, SPEC.sizes.md.height);
    ["개요", "제품", "설정"].forEach((label, index) => {
      const item = makeItem(label, index === 0, "md");
      if (variantSpec.layout === "fill") item.layoutGrow = 1;
      c.appendChild(item);
    });
    if (variantSpec.hasDivider) {
      c.strokes = [hexToPaint(SPEC.divider.fill)];
      c.strokeBottomWeight = SPEC.divider.height;
      c.strokeTopWeight = 0;
      c.strokeLeftWeight = 0;
      c.strokeRightWeight = 0;
    }
    return c;
  }

  c.layoutMode = "VERTICAL";
  c.primaryAxisSizingMode = "AUTO";
  c.counterAxisSizingMode = "FIXED";
  c.itemSpacing = 4;
  c.resize(SPEC.menu.width, 32);
  c.appendChild(makeItem("더보기  v", false, "md"));
  if (variantSpec.open) {
    const menu = frameBox("menu", {
      radius: SPEC.menu.radius,
      fill: SPEC.menu.fill,
      stroke: SPEC.menu.stroke,
    });
    menu.layoutMode = "VERTICAL";
    menu.primaryAxisSizingMode = "AUTO";
    menu.counterAxisSizingMode = "FIXED";
    menu.paddingTop = 8;
    menu.paddingBottom = 8;
    menu.resize(SPEC.menu.width, 1);
    ["설정", "활동 기록", "보관함"].forEach((label) => {
      const row = frameBox("menu item");
      row.layoutMode = "HORIZONTAL";
      row.primaryAxisSizingMode = "FIXED";
      row.counterAxisSizingMode = "FIXED";
      row.counterAxisAlignItems = "CENTER";
      row.paddingLeft = 12;
      row.resize(SPEC.menu.width, 32);
      row.fills = [];
      row.appendChild(txt(label, fontName, SPEC.item.fontSize, SPEC.item.defaultColor));
      menu.appendChild(row);
    });
    c.appendChild(menu);
  }
  return c;
}

// TextArea — label, multiline field, and helper row
function createTextAreaVariant(variantSpec, fontName) {
  const c = figma.createComponent();
  c.name = variantSpec.name;
  c.layoutMode = "VERTICAL";
  c.primaryAxisSizingMode = "AUTO";
  c.counterAxisSizingMode = "FIXED";
  c.itemSpacing = 4;
  c.resize(SPEC.field.width, 1);
  c.fills = [];
  c.appendChild(createLabel(variantSpec.label || "Label", fontName, SPEC.label));

  const field = frameBox("field", {
    radius: SPEC.field.radius,
    fill: SPEC.field.fill,
    stroke: variantSpec.status ? SPEC.statusStroke[variantSpec.status] : SPEC.field.stroke,
  });
  field.layoutMode = "HORIZONTAL";
  field.primaryAxisSizingMode = "FIXED";
  field.counterAxisSizingMode = "FIXED";
  field.paddingTop = SPEC.field.padding[variantSpec.size || "md"];
  field.paddingRight = SPEC.field.padding[variantSpec.size || "md"];
  field.paddingBottom = SPEC.field.padding[variantSpec.size || "md"];
  field.paddingLeft = SPEC.field.padding[variantSpec.size || "md"];
  field.resize(SPEC.field.width, SPEC.field.height);
  field.appendChild(createLabel(
    variantSpec.value || variantSpec.placeholder || "내용을 입력하세요",
    fontName,
    { ...SPEC.text, color: variantSpec.value ? SPEC.text.color : SPEC.text.placeholderColor }
  ));
  c.appendChild(field);

  if (variantSpec.message || variantSpec.counter) {
    const helper = frameBox("helper row");
    helper.layoutMode = "HORIZONTAL";
    helper.primaryAxisSizingMode = "FIXED";
    helper.counterAxisSizingMode = "AUTO";
    helper.primaryAxisAlignItems = "SPACE_BETWEEN";
    helper.resize(SPEC.field.width, 1);
    helper.fills = [];
    helper.appendChild(createLabel(variantSpec.message || "", fontName, SPEC.helper));
    if (variantSpec.counter) helper.appendChild(createLabel(variantSpec.counter, fontName, SPEC.helper));
    c.appendChild(helper);
  }
  return c;
}

// Thumbnail — fixed preview with loading and remove overlays
function createThumbnailVariant(variantSpec, fontName) {
  const c = figma.createComponent();
  c.name = variantSpec.name;
  c.layoutMode = "NONE";
  c.resize(SPEC.frame.size, SPEC.frame.size);
  c.cornerRadius = SPEC.frame.radius;
  c.clipsContent = true;
  c.fills = [hexToPaint(SPEC.frame.fill)];
  c.strokes = [hexToPaint(SPEC.frame.stroke)];
  c.strokeWeight = 1;

  if (variantSpec.state === "image" || variantSpec.state === "loading-image") {
    const image = figma.createFrame();
    image.name = "image";
    image.resize(SPEC.frame.size, SPEC.frame.size);
    image.fills = [hexToPaint("#D7DADC")];
    c.appendChild(image);
  } else if (variantSpec.state === "loading") {
    const skeleton = figma.createFrame();
    skeleton.name = "skeleton";
    skeleton.resize(SPEC.frame.size, SPEC.frame.size);
    skeleton.fills = [hexToPaint(SPEC.frame.stroke)];
    c.appendChild(skeleton);
  } else {
    const placeholder = figma.createFrame();
    placeholder.name = "image placeholder";
    placeholder.resize(SPEC.icon.size, SPEC.icon.size);
    placeholder.x = (SPEC.frame.size - SPEC.icon.size) / 2;
    placeholder.y = (SPEC.frame.size - SPEC.icon.size) / 2;
    placeholder.cornerRadius = 4;
    placeholder.fills = [];
    placeholder.strokes = [hexToPaint(SPEC.icon.color)];
    placeholder.strokeWeight = 2;
    c.appendChild(placeholder);
  }

  if (variantSpec.state === "loading-image") {
    const overlay = figma.createFrame();
    overlay.name = "loading overlay";
    overlay.resize(SPEC.frame.size, SPEC.frame.size);
    overlay.fills = [hexToPaint(SPEC.overlay.fill)];
    c.appendChild(overlay);
    const spinner = figma.createEllipse();
    spinner.name = "spinner";
    spinner.resize(16, 16);
    spinner.x = 24;
    spinner.y = 24;
    spinner.fills = [];
    spinner.strokes = [hexToPaint("#FFFFFF")];
    spinner.strokeWeight = 2;
    overlay.appendChild(spinner);
  }

  if (variantSpec.removable) {
    const remove = figma.createEllipse();
    remove.name = "remove";
    remove.resize(SPEC.remove.size, SPEC.remove.size);
    remove.x = SPEC.frame.size - SPEC.remove.size - SPEC.remove.offset;
    remove.y = SPEC.remove.offset;
    remove.fills = [hexToPaint(SPEC.remove.fill)];
    c.appendChild(remove);
    const x = txt("x", fontName, 12, SPEC.remove.color);
    x.x = remove.x + 6;
    x.y = remove.y + 2;
    c.appendChild(x);
  }
  if (variantSpec.disabled) c.opacity = 0.5;
  return c;
}

// LinearProgress — 트랙 + 채움
function createLinearProgressVariant(variantSpec, fontName) {
  const c = figma.createComponent();
  c.name = variantSpec.name;
  c.layoutMode = "HORIZONTAL";
  c.primaryAxisSizingMode = "FIXED";
  c.counterAxisSizingMode = "FIXED";
  c.resize(240, SPEC.track.height);
  c.cornerRadius = SPEC.track.radius;
  c.fills = [hexToPaint(SPEC.track.fill)];
  c.clipsContent = true;
  const variant = variantSpec.variant || "accent";
  const pct = typeof variantSpec.value === "number" ? variantSpec.value / 100 : 0.4;
  const fill = figma.createFrame();
  fill.name = "fill";
  fill.resize(Math.max(240 * pct, 1), SPEC.track.height);
  fill.cornerRadius = SPEC.track.radius;
  fill.fills = [hexToPaint(SPEC.fillColor[variant] || SPEC.fillColor.accent)];
  c.appendChild(fill);
  return c;
}

// SegmentedControl — 세그먼트 버튼 그룹
function createSegmentedControlVariant(variantSpec, fontName) {
  const c = figma.createComponent();
  c.name = variantSpec.name;
  applyAutoLayout(c, SPEC.container.layout);
  c.cornerRadius = SPEC.container.radius;
  c.fills = [hexToPaint(SPEC.container.fill)];
  ["일간", "주간", "월간"].forEach((t, i) => {
    const seg = frameBox("segment", { layout: SPEC.item.layout, radius: SPEC.item.radius });
    if (i === 0) { seg.fills = [hexToPaint(SPEC.item.selectedFill)]; }
    else seg.fills = [];
    seg.appendChild(txt(t, fontName, SPEC.item.label.fontSize, SPEC.item.label.color));
    c.appendChild(seg);
  });
  return c;
}

// RadioList — 라디오 항목
function createRadioListVariant(variantSpec, fontName) {
  const c = figma.createComponent();
  c.name = variantSpec.name;
  c.layoutMode = variantSpec.orientation === "horizontal" ? "HORIZONTAL" : "VERTICAL";
  c.primaryAxisSizingMode = "AUTO";
  c.counterAxisSizingMode = "AUTO";
  c.itemSpacing = 4;
  c.fills = [];
  const r = SPEC.item.radio;
  [["옵션 A", true], ["옵션 B", false]].forEach(([label, on]) => {
    const item = frameBox("item", { layout: SPEC.item.layout });
    const circle = figma.createEllipse();
    circle.resize(r.size, r.size);
    circle.fills = [];
    circle.strokes = [hexToPaint(on ? r.checkedStroke : r.uncheckedStroke)];
    circle.strokeWeight = r.strokeWeight;
    item.appendChild(circle);
    item.appendChild(txt(label, fontName, SPEC.item.label.fontSize, SPEC.item.label.color));
    c.appendChild(item);
  });
  return c;
}

// Slider — 트랙 + 채움 + thumb
function createSliderVariant(variantSpec, fontName) {
  const c = figma.createComponent();
  c.name = variantSpec.name;
  c.layoutMode = "NONE";
  c.resize(240, SPEC.thumb.size);
  c.fills = [];
  const track = figma.createFrame();
  track.name = "track";
  track.resize(240, SPEC.track.height);
  track.y = (SPEC.thumb.size - SPEC.track.height) / 2;
  track.cornerRadius = 9999;
  track.fills = [hexToPaint(SPEC.track.fill)];
  c.appendChild(track);
  const status = variantSpec.status || "default";
  const fill = figma.createFrame();
  fill.name = "fill";
  fill.resize(156, SPEC.track.height);
  fill.y = track.y;
  fill.cornerRadius = 9999;
  fill.fills = [hexToPaint(SPEC.fillColor[status] || SPEC.fillColor.default)];
  c.appendChild(fill);
  const thumb = figma.createEllipse();
  thumb.name = "thumb";
  thumb.resize(SPEC.thumb.size, SPEC.thumb.size);
  thumb.x = 156 - SPEC.thumb.size / 2;
  thumb.fills = [hexToPaint(SPEC.thumb.fill)];
  thumb.strokes = [hexToPaint(SPEC.thumb.stroke)];
  thumb.strokeWeight = SPEC.thumb.strokeWeight;
  c.appendChild(thumb);
  return c;
}

// Pagination — 페이지 버튼 열 또는 점
function createPaginationVariant(variantSpec, fontName) {
  const c = figma.createComponent();
  c.name = variantSpec.name;
  applyAutoLayout(c, SPEC.component.layout);
  c.fills = [];
  if (variantSpec.variant === "dots") {
    for (let i = 0; i < 4; i++) {
      const dot = figma.createEllipse();
      dot.resize(SPEC.dot.size, SPEC.dot.size);
      dot.fills = [hexToPaint(i === 0 ? SPEC.dot.activeFill : SPEC.dot.inactiveFill)];
      c.appendChild(dot);
    }
  } else {
    ["‹", "1", "2", "3", "›"].forEach((t, i) => {
      const btn = frameBox("page", { radius: SPEC.pageButton.radius });
      btn.resize(SPEC.pageButton.size, SPEC.pageButton.size);
      btn.primaryAxisAlignItems = "CENTER";
      btn.counterAxisAlignItems = "CENTER";
      btn.layoutMode = "HORIZONTAL";
      btn.fills = t === "1" ? [hexToPaint(SPEC.pageButton.currentFill)] : [];
      btn.appendChild(txt(t, fontName, SPEC.pageButton.font.fontSize, SPEC.pageButton.font.color));
      c.appendChild(btn);
    });
  }
  return c;
}

// NumberInput — 필드 + 단위 + 스텝퍼
function createNumberInputVariant(variantSpec, fontName) {
  const c = figma.createComponent();
  c.name = variantSpec.name;
  applyAutoLayout(c, SPEC.component.field.layout);
  c.cornerRadius = SPEC.component.field.radius;
  c.fills = [];
  const status = variantSpec.status || "default";
  c.strokes = [hexToPaint(SPEC.statusStroke[status] || SPEC.statusStroke.default)];
  c.strokeWeight = SPEC.component.field.strokeWeight || 1;
  c.appendChild(txt("50", fontName, 14, SPEC.component.label.color));
  if (variantSpec.unit) c.appendChild(txt(variantSpec.unit, fontName, SPEC.component.unit.fontSize, SPEC.component.unit.color));
  c.appendChild(txt("▲▼", fontName, 10, SPEC.component.unit.color));
  return c;
}

// Selector — 트리거 (드롭다운 닫힌 상태)
function createSelectorVariant(variantSpec, fontName) {
  const c = figma.createComponent();
  c.name = variantSpec.name;
  applyAutoLayout(c, SPEC.trigger.layout);
  c.cornerRadius = SPEC.trigger.radius;
  c.fills = [];
  const status = variantSpec.status || "default";
  c.strokes = [hexToPaint(SPEC.trigger.statusStroke[status] || SPEC.trigger.statusStroke.default)];
  c.strokeWeight = SPEC.trigger.strokeWeight || 1;
  c.counterAxisSizingMode = "FIXED";
  c.resize(220, c.height);
  c.primaryAxisAlignItems = "SPACE_BETWEEN";
  c.appendChild(txt("항목 선택", fontName, SPEC.option.label.fontSize, SPEC.option.label.color));
  c.appendChild(txt("▾", fontName, 12, SPEC.option.label.color));
  return c;
}

// MultiSelector — 트리거 (badges 또는 count)
function createMultiSelectorVariant(variantSpec, fontName) {
  const c = figma.createComponent();
  c.name = variantSpec.name;
  applyAutoLayout(c, SPEC.trigger.layout);
  c.cornerRadius = SPEC.trigger.radius;
  c.fills = [];
  c.strokes = [hexToPaint(SPEC.trigger.stroke)];
  c.strokeWeight = SPEC.trigger.strokeWeight || 1;
  c.counterAxisSizingMode = "FIXED";
  c.resize(240, c.height);
  c.primaryAxisAlignItems = "SPACE_BETWEEN";
  if (variantSpec.display === "badges") {
    const wrap = frameBox("badges", {});
    wrap.itemSpacing = 4;
    ["서울", "부산"].forEach((t) => {
      const b = frameBox("badge", { radius: SPEC.badge.radius, fill: SPEC.badge.fill });
      b.paddingLeft = 8; b.paddingRight = 8; b.paddingTop = 2; b.paddingBottom = 2;
      b.appendChild(txt(t, fontName, 11, SPEC.option.label.color));
      wrap.appendChild(b);
    });
    c.appendChild(wrap);
  } else {
    c.appendChild(txt("3개 선택", fontName, SPEC.option.label.fontSize, SPEC.option.label.color));
  }
  c.appendChild(txt("▾", fontName, 12, SPEC.option.label.color));
  return c;
}

// Popover — 패널
function createPopoverVariant(variantSpec, fontName) {
  const c = figma.createComponent();
  c.name = variantSpec.name;
  applyAutoLayout(c, SPEC.panel.layout);
  c.cornerRadius = SPEC.panel.radius;
  c.fills = [hexToPaint(SPEC.panel.fill)];
  c.strokes = [hexToPaint(SPEC.panel.stroke)];
  c.strokeWeight = SPEC.panel.strokeWeight || 1;
  c.appendChild(txt("팝오버 콘텐츠", fontName, 13, "#1F2023"));
  return c;
}

// MoreMenu — 메뉴 패널
function createMoreMenuVariant(variantSpec, fontName) {
  const c = figma.createComponent();
  c.name = variantSpec.name;
  applyAutoLayout(c, SPEC.menu.layout);
  c.cornerRadius = SPEC.menu.radius;
  c.fills = [hexToPaint(SPEC.menu.fill)];
  c.strokes = [hexToPaint(SPEC.menu.stroke)];
  c.strokeWeight = SPEC.menu.strokeWeight || 1;
  c.counterAxisSizingMode = "FIXED";
  c.resize(180, c.height);
  ["편집", "복제", "삭제"].forEach((t) => {
    const item = frameBox("item", { layout: SPEC.item.layout });
    item.layoutAlign = "STRETCH";
    const color = t === "삭제" ? SPEC.item.dangerColor : SPEC.item.label.color;
    item.appendChild(txt(t, fontName, SPEC.item.label.fontSize, color));
    c.appendChild(item);
  });
  return c;
}

// Lightbox — 풀스크린 미디어 오버레이 (축소 표현)
function createLightboxVariant(variantSpec, fontName) {
  const c = figma.createComponent();
  c.name = variantSpec.name;
  c.layoutMode = "HORIZONTAL";
  c.primaryAxisSizingMode = "FIXED";
  c.counterAxisSizingMode = "FIXED";
  c.resize(360, 240);
  c.primaryAxisAlignItems = "CENTER";
  c.counterAxisAlignItems = "CENTER";
  c.cornerRadius = SPEC.component.radius || 16;
  c.fills = [hexToPaint(SPEC.component.backdrop || "#00000085")];
  c.appendChild(txt(variantSpec.itemType === "video" ? "▶ 비디오" : "이미지", fontName, 14, "#FFFFFF"));
  return c;
}

// 신규 컴포넌트용 fallback 렌더러.
// template별 전용 렌더가 없을 때, 스펙의 공통 형태 키(component/panel/track/
// trigger/container/item/field)에서 layout·fill·radius·stroke를 읽어 대략적 박스를 그린다.
// 세부 디테일은 Figma에서 디자이너가 다듬는다.
function createGenericVariant(variantSpec, fontName) {
  const component = figma.createComponent();
  component.name = variantSpec.name || SPEC.name || SPEC.template;

  // 형태 정보를 담을 만한 최상위 키를 우선순위대로 탐색
  const shapeKeys = ["component", "panel", "track", "trigger", "container", "field", "item"];
  let shape = null;
  for (const key of shapeKeys) {
    if (SPEC[key] && typeof SPEC[key] === "object") { shape = SPEC[key]; break; }
  }

  if (shape && shape.layout) {
    applyAutoLayout(component, shape.layout);
  } else {
    component.layoutMode = "HORIZONTAL";
    component.primaryAxisSizingMode = "AUTO";
    component.counterAxisSizingMode = "AUTO";
    component.paddingTop = 8; component.paddingBottom = 8;
    component.paddingLeft = 12; component.paddingRight = 12;
    component.itemSpacing = 4;
  }

  if (shape && typeof shape.radius === "number") component.cornerRadius = shape.radius;
  else component.cornerRadius = 8;

  if (shape && shape.fill) component.fills = [hexToPaint(shape.fill)];
  else component.fills = [];

  if (shape && shape.stroke) {
    component.strokes = [hexToPaint(shape.stroke)];
    component.strokeWeight = shape.strokeWeight || 1;
  }

  // 라벨: 컴포넌트 이름을 placeholder 텍스트로 넣어 빈 박스가 아니게 함
  const labelStyle = {
    fontSize: 13,
    lineHeight: 20,
    color: (SPEC.text && SPEC.text.color) || (SPEC.label && SPEC.label.color) || "#1F2023",
  };
  component.appendChild(createLabel(SPEC.name || SPEC.template, fontName, labelStyle));

  // 최소 크기 보장
  if (component.width < 24 || component.height < 16) {
    component.resize(Math.max(component.width, 120), Math.max(component.height, 32));
  }
  return component;
}

async function getOrCreatePage(name) {
  if (figma.loadAllPagesAsync) {
    await figma.loadAllPagesAsync();
  }

  const existing = figma.root.children.find((page) => page.name === name);
  if (existing) {
    return existing;
  }

  const page = figma.createPage();
  page.name = name;
  return page;
}

async function generateSpec(componentSpec, generatedPage, originX, originY) {
  SPEC = componentSpec;
  const fontName = await loadFont(SPEC.text?.fontStyle === "Medium" ? "Medium" : "Regular");

  const components = SPEC.variants.map((variant, index) => {
    const component = createVariant(variant, fontName);
    component.x = originX;
    component.y = originY + index * (SPEC.preview?.stepY || SPEC.component?.height || SPEC.component?.minHeight || 120);
    generatedPage.appendChild(component);
    return component;
  });

  if (components.length > 1) {
    const set = figma.combineAsVariants(components, generatedPage);
    set.name = SPEC.name;
    set.x = originX;
    set.y = originY;
    return set;
  } else {
    return components[0];
  }
}

async function generateSelected(ids) {
  const selectedSpecs = SPECS.filter((spec) => ids.includes(spec.id));
  if (selectedSpecs.length === 0) {
    figma.notify("Select at least one component.", { error: true });
    return;
  }

  const generatedPage = await getOrCreatePage("Generated");
  await getOrCreatePage("Published");
  await figma.setCurrentPageAsync(generatedPage);

  const generatedNodes = [];
  const failed = [];
  for (let index = 0; index < selectedSpecs.length; index += 1) {
    const column = index % 2;
    const row = Math.floor(index / 2);
    try {
      const node = await generateSpec(selectedSpecs[index], generatedPage, 80 + column * 760, 80 + row * 560);
      generatedNodes.push(node);
    } catch (error) {
      // 한 컴포넌트가 실패해도 나머지는 계속 생성. 실패 이름 + 사유를 모은다.
      failed.push(selectedSpecs[index].name + " (" + error.message + ")");
      console.error("Failed to generate " + selectedSpecs[index].id + ":", error);
    }
  }

  if (generatedNodes.length > 0) {
    figma.viewport.scrollAndZoomIntoView(generatedNodes);
  }
  if (failed.length > 0) {
    figma.notify("생성 실패 " + failed.length + "개: " + failed.join(" / "), { error: true, timeout: 10000 });
  } else {
    figma.notify("Generated " + generatedNodes.length + " component set(s).");
  }
  figma.closePlugin();
}

figma.showUI(__html__, { width: 360, height: 520, themeColors: true });
figma.ui.postMessage({
  type: "init",
  components: SPECS.map((spec) => ({
    id: spec.id,
    name: spec.name,
    description: spec.description || "",
    variantCount: spec.variants?.length || 0,
  })),
});

figma.ui.onmessage = (message) => {
  if (message.type === "cancel") {
    figma.closePlugin();
    return;
  }

  if (message.type === "generate") {
    generateSelected(message.ids || []).catch((error) => {
      figma.notify("Component generation failed: " + error.message, { error: true });
      figma.closePlugin();
    });
  }
};
