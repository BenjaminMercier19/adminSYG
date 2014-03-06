<?php 
$cpt = 0;
echo json_encode(dirToArray(dirname(dirname( dirname(__FILE__)))."\\config"));


function dirToArray($dir) { 
   global $cpt;   
   $result = array(); 

   $cdir = scandir($dir); 
   foreach ($cdir as $key => $value) 
   { 
      if (!in_array($value,array(".",".."))) 
      { 
         if (is_dir($dir . DIRECTORY_SEPARATOR . $value)) 
         { 
            $array = array('text'=>$value, 'children' => dirToArray($dir . DIRECTORY_SEPARATOR . $value));
            $result[] = $array; 
         } 
         else 
         { 
            $array = array('text'=>$value, 'type'=>'xml',  'a_attr' =>array("href"=> "https://sygdev.systra.info/".str_replace("\\","/", explode("syg\\", $dir)[1])."/".$value, "target"=>"_blank"), 'icon'=>'glyphicon glyphicon-cog');
            $result[] = $array; 
         } 
      } 
   } 
   
   return $result; 
}

?>