/**
 * Convert Pascal VCL defs to WeBuilder plugin format.
 *
 * Convert Pascal VCL defs created with pdScript IDE into WeBuilder JScript plugin format.
 *
 * @category  WeBuilder Plugin
 * @package   PAS2WJS
 * @author    Peter Klein <pmk@io.dk>
 * @copyright 2016 Peter Klein
 * @license   http://www.freebsd.org/copyright/license.html  BSD License
 * @version   1.0
 */

/**
 * [CLASS/FUNCTION INDEX of SCRIPT]
 *
 *     30   function ConvertDocument()
 *    162   function OnInstalled2()
 *
 * TOTAL FUNCTIONS: 2
 * (This index is automatically created/updated by the WeBuilder plugin "DocBlock Comments")
 *
 */

/**
 * Convert editor content
 *
 * @return void
 */
function ConvertDocument() {

    if (Script.ReadSetting("Show Confirmbox before converting?", "1") == "1") {
        if (!Confirm("Does the content of the document contain a VCL def created with pdScript IDE?")) {
            return;
        }
    }

    var open = 0;
    var itemsOpen = 0;
    var out = "";
    var variable = "";
    var objtype = "";
    var items = "";
    var itemsTag = "";
    var parent = "";
    var prop = "";
    var unsupported = 0;

    var SL = new TStringList;
    SL.Text = Editor.Text;

    var IL = new TStringList;
    // Comma separated list of properties that isn't supported in WeBuilder JScript
    IL.CommaText = "Font.Charset,TextHeight,Margins.Left,Margins.Right,Margins.Top,Margins.Bottom";

    // Comma separated list of properties that isn't needed
    //IL.CommaText += ",OldCreateOrder,DesignSize,PixelsPerInch,ExplicitLeft,ExplicitTop,ExplicitWidth,,BiDiMode,ParentBiDiMode";


    var LL = new TStringList;
    // Comma separated list of classes that isn't supported in WeBuilder JScript
    LL.CommaText = "THeaderControl,THotKey,TMainMenu,TRadioGroup,TScrollBar,TStringGrid,TUpDown";

    Script.ClearMessages;

    for (var i=0;i<SL.Count;i++) {
        var line = Trim(SL[I]);
        var pattern = "^\\s*object\\s([^:]*):\\s(.*)";
        if (RegexMatch(line, pattern, false) != "") {
            // Start of object def
            variable = RegexReplace(line, pattern, "$1", false);
            objtype = RegexReplace(line,  pattern, "$2", false);
            if (objtype == "TPSForm") objtype = "TForm";

            if (LL.IndexOf(objtype) > -1) {
                Script.Message("Skipping unsupported class: \"" + objtype + "\"");
                unsupported = 1;
                continue;
            }

            out += "\n" + variable + " = new " + objtype + "(WeBuilder);\n";
            open++;
            if (parent == "") {
                parent = variable;
            }
            else {
                out += variable + ".Parent = " + parent + ";\n";
            }
        }
        else if (RegexMatch(line, "^\\s*end", false) != "") {
            // End of object def
            variable = "";
            objtype = "";
            unsupported = 0;
            open--;
        }
        else if ((open > 0) && (variable != "") && (unsupported == 0)) {
            // Inside object def

            if (itemsOpen == 1) {
                // Inside items def
                itemVal = RegexReplace(line, "^\\s*'([^']*).*", "\"$1\"", false);
                out += variable + "." + itemsTag + ".Add(" + itemVal + ");\n";

                if (RegexMatch(line, "^\\s*'([^'])*'\\)", false) != "") {
                    // End of itemdef
                    itemsOpen = 0;
                    itemVal = "";
                }

            }
            else if (RegexMatch(line,"^\\s*(Items|Lines)\\.Strings\\s=\\s\\($", false) !="") {
                // is start of items?
                itemsOpen = 1;
                itemsTag = RegexReplace(line,"^.*(Items|Lines).*", "$1", false);
                itemVal = "";
            }
            else {
                // regular object def
                if (RegexMatch(line,"^.*=\\s\\[.*\\]",false) != "") {
                    // rewrite format "[opt1, opt2, opt3]" into "opt1 + opt2 + opt3"
                    line = RegexReplace(RegexReplace(line, "\\[|\\]", "", false), ",\\s", " + ", false);
                    if (RegexMatch(line, "=\\s*$", false) != "") {
                        prop = RegexReplace(line,"^\\s*([^\\s]*).*","$1",false);
                        Script.Message("Skipping empty property: \"" + prop + "\" of " + variable + " (class: " + objtype + ")");
                        continue;
                    }
                }
                else {
                    // Skip properties that WeBuilder doesn't support
                    prop = RegexReplace(line,"^\\s*([^\\s]*).*","$1",false);
                    if (IL.IndexOf(prop) > -1) {
                        Script.Message("Skipping unsupported property: \"" + prop + "\" of " + variable + " (class: " + objtype + ")");
                        continue;
                    }
                    if (RegexMatch(line, "=\\s*$", false) != "") {
                        Script.Message("Skipping empty property: \"" + prop + "\" of " + variable + " (class: " + objtype + ")");
                        continue;
                    }
                    var comment = "";
                    if (prop == "Parent") {
                        comment =" // Delete other 'Parent' property"
                    }
                    line = RegexReplace(line,"'([^']*)'", "\"$1\"",true);
                }
                out += variable + "." + line + ";" + comment + "\n";
            }
        }
    }
    if (Length(out) == 0) {
        Script.Message("Not a Pascal VCL def! - Nothing converted")
    }
    else {
        Editor.Text = out;
    }
    delete SL;
    delete IL;
    delete LL;
}

/**
 * Show info when plugin is installed
 *
 * @return void
 */
function OnInstalled2() {
  Alert("PAS2WJS 1.0 by Peter Klein installed sucessfully!");
}

if (Script.ReadSetting("Add PAS2WJS menu item?", "1") == "1") {
    Script.ConnectSignal("installed", "OnInstalled2");
    var bmp = new TBitmap;
    var icon = LoadFileToBitmap(Script.Path + "pdScriptIDE.png", bmp);
    var act = Script.RegisterDocumentAction("DevMode", "PAS2WJS", "", "ConvertDocument");
    //Actions.SetIcon(act, bmp);
    delete bmp;
}