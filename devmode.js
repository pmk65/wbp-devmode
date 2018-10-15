/**
 * Auto disable/enable plugin after saving.
 *
 * Creating plugins for WeBuilder had one big problem due to them being compiled before running.
 * You had to manually select the Plugin Manager, find the plugin and disable/enable it.
 * This plugin removes that problem, as it automatically disable/enable a selected plugin
 * after saving the file.
 *
 * @category  WeBuilder Plugin
 * @package   DevMode
 * @author    Peter Klein <pmk@io.dk>
 * @copyright 2017
 * @license   http://www.freebsd.org/copyright/license.html  BSD License
 * @version   1.20
 */

/**
 * [CLASS/FUNCTION INDEX of SCRIPT]
 *
 *     37   function OnSave(Sender)
 *     68   function OnInstalled()
 *
 * TOTAL FUNCTIONS: 2
 * (This index is automatically created/updated by the WeBuilder plugin "DocBlock Comments")
 *
 */

/*$INCLUDE pas2wjs.js*/

/**
 * Event triggered when document has beeen saved
 *
 * @param  object   Sender
 *
 * @return void
 */
function OnSave(Sender) {

    if (Regexmatch(Sender.Filename, "Blumentals\\\\WeBuilder\\\\plugins", false) != "") {
        var path = ExtractFilePath(Sender.Filename);
        if (FileExists(path + "plugin.ini")) {
            var file = ExtractFileName(Sender.Filename);
            var ini = new TIniFile(path + "plugin.ini");
            var name = ini.ReadString("Blumentals WeBuilder Plugin", "name", "");
            var entry = ini.ReadString("Blumentals WeBuilder Plugin", "entry", "");
			var index;
			var SL = new TStringList;
			SL.CommaText = Script.ReadSetting("Optional trigger files", "");

			if ((name != "DevMode") && ((file == entry) || (SL.Find(file, index) == true))) {
                if (Script.ReadSetting("Show notice?", "0") == "1") {
                    Script.Message("DevMode: Plugin \"" + name + "\" auto disabled/enabled");
                }
                PluginManager.DisablePlugin(name);
                PluginManager.EnablePlugin(name);
            }
			delete SL;
            delete ini;
        }
    }
}

/**
 * Show info when plugin is installed.
 *
 * @return void
 */
function OnInstalled() {
  Alert("DevMode 1.20 by Peter Klein installed sucessfully!");
}

Script.ConnectSignal("installed", "OnInstalled");
Script.ConnectSignal("document_after_save", "OnSave");
