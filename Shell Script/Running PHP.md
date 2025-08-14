# Run PHP program in cli

File: entry.php
```
<?php
try{
	$isCLI = PHP_SAPI === "cli";
	if(!$isCLI) throw new RuntimeException("CLI only");

	$stdIn = "";
	$hStdIn = fopen("php://stdin", "r");
	if(fstat($hStdIn)['size']??0){
		while(FALSE !== ($line=fgets($hStdIn))) $stdIn .= $line;
	}
	if(get_resource_type($hStdIn)==="stream") fclose($hStdIn);
	
	$str = "STDOUT -> Arguments Count: ".$argc."\n".print_r($argv, TRUE);
	
	if(file_put_contents("php://stdout", $str)===FALSE) throw new RuntimeException("STDOUT Failed");

	if(file_put_contents('php://stderr', "STDERR -> STDIN is: ".($stdIn?:"<N/A>"))===FALSE) throw new RuntimeException("STDERR Failed");

	exit(0);
} catch (Throwable $e){
	if(file_put_contents('php://stderr', $e->getMessage())===FALSE) error_log("STDERR Failed");
	exit($e->getCode()+1);
}
```

File: in.txt
```
For redirection and pipeline.
```

Command Prompt Batch File
```
@ECHO OFF
REM RUN PHP program
::RUN PHP program
SET "$PHP_BIN=C:\php-8.3.13\php.exe"
SET "$ENTRY=%~dp0entry.php"
%$PHP_BIN% %$ENTRY% %*
```

PowerShell
```
# Run PHP Program
$PHPBIN = "C:\php-8.3.13\php.exe"
$PROGRAM = $PSScriptRoot+"\entry.php"
$Input | & $PHPBIN $PROGRAM $Args
```