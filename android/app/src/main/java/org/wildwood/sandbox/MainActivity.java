package org.wildwood.sandbox;

import android.app.Activity;
import android.os.Bundle;
import android.graphics.Color;
import android.view.View;
import android.webkit.*;
import android.widget.*;
import java.io.*;
import java.net.*;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.util.*;
import java.util.concurrent.Executors;
import java.util.concurrent.ExecutorService;
import java.util.zip.*;
import org.json.*;

/** Local HTTPS origin keeps saves stable across bundled and downloaded versions. */
public class MainActivity extends Activity {
 private static final String REPO="failimus48-max/wildwood", BRANCH="main";
 private static final String ORIGIN="https://appassets.androidplatform.net";
 private static final int MAX_FILE=8*1024*1024, MAX_BUNDLE=32*1024*1024;
 private WebView web; private TextView status; private Button update;
 private final ExecutorService worker=Executors.newSingleThreadExecutor();
 private volatile File playing; private volatile File available; private volatile boolean checking;
 private long lastCheck=0;
 @Override public void onCreate(Bundle state) {
  super.onCreate(state);
  getWindow().getDecorView().setSystemUiVisibility(View.SYSTEM_UI_FLAG_FULLSCREEN|View.SYSTEM_UI_FLAG_HIDE_NAVIGATION|View.SYSTEM_UI_FLAG_IMMERSIVE_STICKY);
  LinearLayout layout=new LinearLayout(this);layout.setOrientation(LinearLayout.VERTICAL);layout.setBackgroundColor(Color.rgb(25,49,47));
  LinearLayout bar=new LinearLayout(this);bar.setPadding(12,0,8,0);bar.setGravity(android.view.Gravity.CENTER_VERTICAL);
  status=new TextView(this);status.setTextColor(Color.rgb(228,238,213));status.setTextSize(11);status.setText("Wildwood · checking for updates");bar.addView(status,new LinearLayout.LayoutParams(0,38,1));
  update=new Button(this);update.setText("Check updates");update.setTextSize(10);bar.addView(update,new LinearLayout.LayoutParams(-2,40));
  web=new WebView(this);layout.addView(bar);layout.addView(web,new LinearLayout.LayoutParams(-1,0,1));setContentView(layout);
  WebSettings settings=web.getSettings();settings.setJavaScriptEnabled(true);settings.setDomStorageEnabled(true);settings.setAllowFileAccess(false);settings.setAllowContentAccess(false);settings.setMixedContentMode(WebSettings.MIXED_CONTENT_NEVER_ALLOW);settings.setMediaPlaybackRequiresUserGesture(true);
  String active=getPreferences(0).getString("bundle","");File dir=new File(new File(getFilesDir(),"bundles"),active);
  playing=!active.isEmpty()&&new File(dir,"index.html").isFile()?dir:null;
  web.setWebViewClient(new WebViewClient(){
   @Override public WebResourceResponse shouldInterceptRequest(WebView v,WebResourceRequest r){return local(r.getUrl());}
   @Override public boolean shouldOverrideUrlLoading(WebView v,WebResourceRequest r){return true;}
   @Override public void onReceivedError(WebView v,WebResourceRequest request,WebResourceError error){if(request.isForMainFrame())showStatus("Unable to open game · restart to retry");}
  });
  web.setWebChromeClient(new WebChromeClient());
  web.loadUrl(ORIGIN+"/game/index.html");
  update.setOnClickListener(v->{if(available!=null){playing=available;available=null;web.reload();update.setText("Check updates");showStatus("Latest version · saved on this device");}else checkUpdates(true);});
  checkUpdates(true);
 }
 private WebResourceResponse local(android.net.Uri uri){
  try {
   if(!"https".equals(uri.getScheme())||!"appassets.androidplatform.net".equals(uri.getHost())||!uri.getPath().startsWith("/game/"))return blocked();
   String name=uri.getPath().substring(6);if(!safePath(name))return blocked();
   File base=playing;InputStream input=base==null?getAssets().open("game/"+name):new FileInputStream(new File(base,name));
   String ext=name.substring(name.lastIndexOf('.')+1),mime;
   switch(ext){case "html":mime="text/html";break;case "js":mime="application/javascript";break;case "css":mime="text/css";break;case "json":mime="application/json";break;case "png":mime="image/png";break;case "jpg":mime="image/jpeg";break;case "woff":mime="font/woff";break;case "woff2":mime="font/woff2";break;case "mp3":mime="audio/mpeg";break;case "ogg":mime="audio/ogg";break;case "wav":mime="audio/wav";break;default:return blocked();}
   return new WebResourceResponse(mime,"UTF-8",200,"OK",Collections.singletonMap("Cache-Control","no-store"),input);
  }catch(Exception ignored){return blocked();}
 }
 private static WebResourceResponse blocked(){return new WebResourceResponse("text/plain","UTF-8",404,"Not Found",Collections.emptyMap(),new ByteArrayInputStream(new byte[0]));}
 static boolean safePath(String p){return p!=null&&p.matches("[A-Za-z0-9_-]+\\.(html|css|js|json|woff2?|png|jpg|mp3|ogg|wav)");}
 private void showStatus(String s){runOnUiThread(()->{if(!isDestroyed())status.setText(s);});}
 private void checkUpdates(boolean force){
  if(checking||(!force&&System.currentTimeMillis()-lastCheck<60000))return;
  checking=true;lastCheck=System.currentTimeMillis();showStatus("Checking GitHub for game updates…");
  worker.execute(()->{File staging=null;try{
   JSONObject commit=new JSONObject(new String(download("https://api.github.com/repos/"+REPO+"/commits/"+BRANCH,256*1024),StandardCharsets.UTF_8));
   String sha=commit.getString("sha");if(!sha.matches("[0-9a-f]{40}"))throw new IOException("Invalid revision");
   String current=getPreferences(0).getString("bundle","");
   if(sha.equals(current)){showStatus(available==null?"Up to date · saved on this device":"Update ready · tap Play update");return;}
   JSONObject manifest=new JSONObject(new String(download("https://raw.githubusercontent.com/"+REPO+"/"+sha+"/game/manifest.json",256*1024),StandardCharsets.UTF_8));
   if(manifest.getInt("schema")!=1||!"index.html".equals(manifest.getString("entry")))throw new IOException("Unsupported bundle");
   JSONArray files=manifest.getJSONArray("files");if(files.length()==0||files.length()>128)throw new IOException("Invalid file count");
   Map<String,JSONObject> expected=new HashMap<>();long total=0;
   for(int i=0;i<files.length();i++){JSONObject f=files.getJSONObject(i);String p=f.getString("path");int size=f.getInt("bytes");if(!safePath(p)||size<0||size>MAX_FILE||!f.getString("sha256").matches("[0-9a-f]{64}")||expected.put(p,f)!=null)throw new IOException("Invalid file manifest");total+=size;}
   if(total>MAX_BUNDLE||!expected.containsKey("index.html"))throw new IOException("Bundle too large or missing entry");
   showStatus("Downloading game update · your game stays playable");
   byte[] zip=download("https://codeload.github.com/"+REPO+"/zip/"+sha,MAX_BUNDLE);
   File bundles=new File(getFilesDir(),"bundles");bundles.mkdirs();staging=new File(bundles,"staging-"+sha);if(staging.exists())delete(staging);if(!staging.mkdirs())throw new IOException("Cannot stage update");
   String prefix="wildwood-"+sha+"/game/";Set<String> seen=new HashSet<>();
   try(ZipInputStream zin=new ZipInputStream(new ByteArrayInputStream(zip))){ZipEntry e;int count=0;while((e=zin.getNextEntry())!=null){if(++count>2048)throw new IOException("Too many archive entries");String name=e.getName();if(!e.isDirectory()&&name.startsWith(prefix)){String p=name.substring(prefix.length());JSONObject f=expected.get(p);if(f!=null){if(!seen.add(p))throw new IOException("Duplicate archive file");byte[] bytes=readLimited(zin,f.getInt("bytes"));if(bytes.length!=f.getInt("bytes")||!hash(bytes).equals(f.getString("sha256")))throw new IOException("Incomplete or damaged update");try(FileOutputStream out=new FileOutputStream(new File(staging,p))){out.write(bytes);}}}zin.closeEntry();}}
   if(seen.size()!=expected.size())throw new IOException("Missing update files");
   File target=new File(bundles,sha);if(target.exists())delete(target);if(!staging.renameTo(target))throw new IOException("Cannot activate update");staging=null;
   // Commit the pointer only after every file has been checked and directory promoted.
   if(!getPreferences(0).edit().putString("bundle",sha).commit())throw new IOException("Cannot save update pointer");
   available=target;runOnUiThread(()->{if(!isDestroyed()){update.setText("Play update");status.setText("Update ready · tap to play, or reopen the app");}});
   // Keep the running version until the player applies the update. Remove only older bundles.
   File active=playing;File[] old=bundles.listFiles();if(old!=null)for(File f:old)if(!f.equals(target)&&!f.equals(active))delete(f);
  }catch(Exception ex){showStatus("Offline / update unavailable · playing saved version");}finally{if(staging!=null)delete(staging);checking=false;}});
 }
 private static byte[] download(String address,int max)throws IOException{
  HttpURLConnection c=(HttpURLConnection)new URL(address).openConnection();c.setConnectTimeout(12000);c.setReadTimeout(20000);c.setRequestProperty("User-Agent","Wildwood-Android/1.0");c.setRequestProperty("Accept","application/vnd.github+json");
  try{if(c.getResponseCode()!=200)throw new IOException("Update server unavailable");try(InputStream in=c.getInputStream()){return readLimited(in,max);}}finally{c.disconnect();}
 }
 private static byte[] readLimited(InputStream in,int max)throws IOException{ByteArrayOutputStream out=new ByteArrayOutputStream();byte[] b=new byte[8192];int n;while((n=in.read(b))!=-1){if(out.size()+n>max)throw new IOException("Size limit exceeded");out.write(b,0,n);}return out.toByteArray();}
 private static String hash(byte[] b)throws Exception{StringBuilder s=new StringBuilder();for(byte v:MessageDigest.getInstance("SHA-256").digest(b))s.append(String.format(Locale.ROOT,"%02x",v&255));return s.toString();}
 private static void delete(File f){File[] list=f.listFiles();if(list!=null)for(File child:list)delete(child);f.delete();}
 @Override protected void onResume(){super.onResume();if(web!=null){web.onResume();checkUpdates(false);}}
 @Override protected void onPause(){if(web!=null)web.onPause();super.onPause();}
 @Override protected void onDestroy(){worker.shutdownNow();if(web!=null)web.destroy();super.onDestroy();}
 @Override public void onBackPressed(){if(web!=null)web.evaluateJavascript("document.getElementById('modal').hidden?document.getElementById('pause').click():document.getElementById('close-modal').click()",null);}
}
