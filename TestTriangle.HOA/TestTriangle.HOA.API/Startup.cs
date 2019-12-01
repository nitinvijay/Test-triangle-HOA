using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Swashbuckle.AspNetCore.Swagger;
using TestTriangle.HOA.API.Command.Handler;
using TestTriangle.HOA.API.Middleware;
using TestTriangle.HOA.API.Query.Handler;
using TestTriangle.HOA.Common;
using TestTriangle.HOA.Data.Repository;
using TestTriangle.HOA.Data.Repository.Contracts;

namespace TestTriangle.HOA.API
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
            ConfigHelper.Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddScoped<IUnitOfWork, UnitOfWork>();
            services.AddScoped<CustomerCommandHandler>();
            services.AddScoped<CustomerQueryHandler>();
            services.AddScoped<TicketCommandHandler>();
            services.AddScoped<TicketQueryHandler>();
            services.AddScoped<CommonQueryHandler>();

            services.AddSwaggerGen(c =>
            {
                c.SwaggerDoc("v1", new Info { Title = "Test triangle HOA API", Version = "v1" });
            });

            services.Configure<CookiePolicyOptions>(options =>
            {
                // This lambda determines whether user consent for non-essential cookies is needed for a given request.
                options.CheckConsentNeeded = context => true;
                options.MinimumSameSitePolicy = SameSiteMode.None;
            });

            //services.AddAuthentication(AzureADDefaults.AuthenticationScheme)
            //    .AddAzureAD(options => Configuration.Bind("AzureAd", options));

            //services.Configure<OpenIdConnectOptions>(AzureADDefaults.OpenIdScheme, options =>
            //{
            //    options.Authority = options.Authority + "/v2.0/";
            //    options.TokenValidationParameters.ValidateIssuer = false;
            //});

            services.AddMvc(options =>
            {
                //var policy = new AuthorizationPolicyBuilder()
                //    .RequireAuthenticatedUser()
                //    .Build();
                //options.Filters.Add(new AuthorizeFilter(policy));
            })
                .AddJsonOptions(
            options => options.SerializerSettings.ReferenceLoopHandling = Newtonsoft.Json.ReferenceLoopHandling.Ignore
        )
            .SetCompatibilityVersion(CompatibilityVersion.Version_2_1);

            //IdentityModelEventSource.ShowPII = true;
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IHostingEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }
            else
            {
                // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
                app.UseHsts();
            }

            app.UseHttpsRedirection();
            app.UseMiddleware(typeof(ExceptionHandlingMiddleWare));
            app.UseSwagger();
            // Enable middleware to serve swagger-ui (HTML, JS, CSS, etc.), 
            // specifying the Swagger JSON endpoint.
            app.UseSwaggerUI(c =>
            {
                c.SwaggerEndpoint("/swagger/v1/swagger.json", "Test triangle HOA API");
            });
            app.UseMvc();
        }
    }
}
