# webuilder-devmode
Plugin for Blumentals WeBuilder/RapidPHP/RapidCSS/HTMLPad editors

This is a plugin for the following editors:

Webuilder: http://www.webuilderapp.com/<br/>
RapidPHP: http://www.rapidphpeditor.com/<br/>
RapidCSS: https://www.rapidcsseditor.com/<br/>
HTMLPad: https://www.htmlpad.net/


#### Function:
A Plugin for WeBuilder plugin developers.

Creating plugins for WeBuilder had one big problem due to them being compiled before running:
You had to manually select the Plugin Manager, find the plugin and disable/enable it EVERY TIME you made a change to the code.

But with the latest version of WeBuilder it's now possible to control that action from a plugin.

This plugin automatically disable/enable a plugin after saving the script file.

**Usage:**
When installed/enabled, any plugin scripts saved in the "\AppData\Roaming\Blumentals\WeBuilder\plugins" folder will trigger an automatic disable/enable of the plugin.

**New feature:**
- You can now set optional trigger filenames. So if your plugin got a file named "index.html", and you add that to options, then the plugin will also be reloaded if you save a file with that name.

- Now comes with an extra script to help creating plugin GUI.
This script can convert Pascal VCL defs created with pdScript IDE into WeBuilder FastScript plugin format.
To create the GUI code, you'll need the free [pdScript IDE](http://www.be-precision.com/products/pdscript/) program. An "Integrated Development Environment for writting the code and designing the forms (GUI) in a Pascal Script language."

**Workflow for converting Pascal VCL defs created with pdScript IDE into WeBuilder FastScript:**
1) First you create/setup your GUI using pdScript IDE. Then you Right-Click on your GUI and select "View as text"
2) Now copy text (VCL) and paste it into WeBuilder. Then select the WeBuilder plugin "Devmode/PAS2WJS" menu option. It will then transform the code into FastScript plugin code format.

NOTE: The conversion is not 100%, and the code produced usually need some manual adjustments.


#### Installation:
1) Download plugin .ZIP file.
2) Open editor and select "Plugins -> Manage Plugins" from the menu.
3) Click "Install" and select the .ZIP file you downloaded in step 1.
