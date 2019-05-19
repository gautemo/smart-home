package app.gautemo.smarthome

import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import android.webkit.WebView

class MainActivity : AppCompatActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)
        addWeather()
    }

    fun addWeather(){
        val myWebView: WebView = findViewById(R.id.weatherView)
        myWebView.settings.javaScriptEnabled = true
        myWebView.setBackgroundColor(0x00000000)
        myWebView.loadUrl("https://weather-oslo.netlify.com/")
    }
}
