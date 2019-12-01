using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text;
using System.Threading.Tasks;

namespace TestTriangleHOA.Web.Service
{
    public class RestService
    {
        private HttpClient _httpClient;

        public RestService(string baseURI, string resourceId)
        {
            _httpClient = new HttpClient();
            _httpClient.DefaultRequestHeaders.Accept.Clear();
            _httpClient.BaseAddress = new Uri(baseURI);
            _httpClient.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
            //var clientId = ConfigHelper.GetClientId();
            //var clientSecret = ConfigHelper.GetClientSecrete();
            //var token = TokenManager.GetToken(clientId, clientSecret, resourceId);
            //_httpClient.DefaultRequestHeaders.Remove("Authorization");
            //_httpClient.DefaultRequestHeaders.Add("Authorization", "Bearer " + token);
        }

        private StringContent BuildStringContent(object value)
        {
            string content = JsonConvert.SerializeObject(value);
            return new StringContent(content, Encoding.UTF8, "application/json");
        }

        private TResult DeserializeObject<TResult>(string content)
        {
            try
            {
                return JsonConvert.DeserializeObject<TResult>(content);
            }
            catch (JsonSerializationException jsonException)
            {
                throw new Exception("Error in Deserialization");
            }
        }

        private T CreateException<T>(HttpResponseMessage response) where T : Exception, new()
        {
            string responseContent = String.Empty;

            if (response.StatusCode == System.Net.HttpStatusCode.InternalServerError)
            {
                responseContent = response.Content.ReadAsStringAsync().Result;
            }
            else
            {
                responseContent = response.ReasonPhrase;
            }

            return Activator.CreateInstance(typeof(T), responseContent) as T;
        }

        public T SendAsync<T>(string url, HttpMethod httpMethod, object request = null )
        {
            HttpResponseMessage response;

            if(httpMethod == HttpMethod.Get)
            {
                response = _httpClient.GetAsync(url).Result;
            }
            else if(httpMethod == HttpMethod.Post)
            {
                HttpContent content = BuildStringContent(request);
                response = _httpClient.PostAsync(url, content).Result;
            }
            else if(httpMethod == HttpMethod.Put)
            {
                HttpContent content = BuildStringContent(request);
                response = _httpClient.PutAsync(url, content).Result;
            }
            else if(httpMethod == HttpMethod.Delete)
            {
                response = _httpClient.DeleteAsync(url).Result;
            }
            else
            {
                HttpRequestMessage httpRequest = new HttpRequestMessage() { Method = httpMethod, Content = BuildStringContent(request), RequestUri = new Uri(_httpClient.BaseAddress + url)};
                response = _httpClient.SendAsync(httpRequest).Result;
            }

            if (!response.IsSuccessStatusCode)
            {
                throw CreateException<Exception>(response);
            }
            else
            {
                string responseContent = response.Content.ReadAsStringAsync().Result;
                return DeserializeObject<T>(responseContent);
            }
        }

        ~RestService()
        {
            _httpClient.Dispose();
        }
    }
}
