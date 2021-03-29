# Úrovně ověření Bulbota
Místo tradičních Trusted, Moderátor a Administrátor které vetšina ostatních botů použivá pro ověřování platnosti příkazů Bulbbot používá **systém urovní ověření** který teoreticky dovoluje používat až 100 ruzných rolí to gate commands. (?)

## Základní urovně ověření
Každý příkaz má specifickou uroveň ověření přednastavenou . To indikuje pokud příkaz může být použit z role everyone, Trusted user, moderátorem nebo administrátorem. Každá z těchno rolí ma korespondující úrověň ověření:
- Everyone (`0`)
- Trusted (`25`)
- Moderátor (`50`)
- Administrátor (`75`)
- Majitel serveru (`100`)

### Specialní případy
Role sami o sobě můžou také ovlivnit uroveň ověření. Uživatel který má roli s oprávněním `ADMINISTRATOR` bude mu automaticky přidělena uroveň ověření hodnoty `75` i když jejich role není konfigurovaná jako **Administrátor**
-Pokud má role oprávnéní `ADMINISTRATOR` bude ji automaticky přidělena uroveň ověření `75`
- Majitelovi serveru bude automaticky přidělana uroveň ověření hodnoty `100`

### Uprava ověření
Abyste mohli vidět všechny upravené urovně oveření definované ve vašem serveru použijte následující příkaz:
``!override list`` - toto zobrazí všechny definované urovně ověrení pro role a příkazy a pokud jsou příkazy zapnuté nebo vypnuté

## Upravené ověření rolí
Pokud byste rádi přidali upravenou urověň ověření vzpjatou s rolí použíjte nasledující příkaz:
``!override create role <ID role> <ověření>`` - toto nastaví novou uroveň ověření pro danou roli.

K modifikaci nebo upravení urovně ověření existující použíjte následující příkaz:
``!override edit role <role id> <new clearance>`` - this will set the clearance level to the new level.

And to remove a roles clearance run the following command:
``!override remove role <role id>`` - this will delete the record of that clearance tied to that role.

## Custom Command Clearance
If you would like to change the default clearance level of a command run the following command:
``!override create command <command name> <clearance>`` - this will set the commands clearance level to that clearance.

To modify or edit an existing commands clearance run the following command:
``!override edit command <command name> <new clearance>`` - this will set the clearance level to the new level.

And to remove a commands clearance run the following command:
``!override remove command <command name>`` - this will delete the record of that clearance tied to that role.

To disable commands from usage in your server run the following command:
``!override disable <command name>`` - this will disable the command for **everyone** in the server.

To enable a command run the following command:
``!override enable <command name>`` - this will enable the command in the server.
