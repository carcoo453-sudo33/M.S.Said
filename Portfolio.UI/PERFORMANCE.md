# Performance & Optimization Guide

This document outlines the performance optimizations implemented in the Portfolio application and provides guidelines for maintaining optimal performance.

## 🚀 Performance Features Implemented

### 1. Image Optimization
- **Lazy Loading**: Images load only when needed using `ng-lazyload-image`
- **Responsive Images**: Automatic srcset generation for different screen sizes
- **WebP Support**: Modern image format with fallbacks
- **Loading States**: Skeleton loaders while images load
- **Error Handling**: Graceful fallbacks for failed image loads

### 2. Bundle Optimization
- **Tree Shaking**: Unused code automatically removed
- **Code Splitting**: Routes loaded on-demand
- **Vendor Chunking**: Third-party libraries separated
- **Minification**: JavaScript and CSS minified in production
- **Compression**: Gzip/Brotli compression enabled

### 3. Performance Monitoring
- **Core Web Vitals**: FCP, LCP, FID, CLS tracking
- **Network Monitoring**: Connection speed detection
- **Real-time Metrics**: Development performance overlay
- **Analytics Integration**: Performance data collection

### 4. Advanced Dependency Injection
- **Optimized Providers**: Efficient service instantiation
- **Feature Flags**: Conditional feature loading
- **Environment-based Configuration**: Different configs per environment
- **Lazy Services**: Services loaded only when needed

## 📊 Performance Scripts

### Bundle Analysis
```bash
npm run analyze
```
Generates detailed bundle analysis reports:
- `bundle-report.html` - Webpack Bundle Analyzer
- `source-map-report.html` - Source Map Explorer

### Lighthouse Audit
```bash
npm run lighthouse
```
Runs comprehensive Lighthouse audits on multiple pages:
- Performance scores
- Core Web Vitals
- Accessibility checks
- SEO analysis

### Complete Performance Audit
```bash
npm run perf:analyze
```
Runs both bundle analysis and Lighthouse audits.

## 🎯 Performance Targets

### Core Web Vitals
- **First Contentful Paint (FCP)**: < 1.8s
- **Largest Contentful Paint (LCP)**: < 2.5s
- **First Input Delay (FID)**: < 100ms
- **Cumulative Layout Shift (CLS)**: < 0.1

### Bundle Size Targets
- **Initial Bundle**: < 1.5MB
- **Individual Chunks**: < 500KB
- **Component Styles**: < 6KB

### Lighthouse Scores
- **Performance**: > 90
- **Accessibility**: > 95
- **Best Practices**: > 90
- **SEO**: > 90

## 🛠️ Optimization Techniques

### 1. Image Optimization
```typescript
// Use OptimizedImageComponent
<app-optimized-image
  [src]="imageUrl"
  [alt]="imageAlt"
  [aspectRatio]="'16/9'"
  [loading]="'lazy'"
  [priority]="'high'"
  [sizes]="OptimizedImageComponent.generateSizes()"
  [srcset]="OptimizedImageComponent.generateSrcSet(baseUrl)">
</app-optimized-image>
```

### 2. Lazy Loading Routes
```typescript
// Implement lazy loading for routes
const routes: Routes = [
  {
    path: 'projects',
    loadComponent: () => import('./components/projects/projects').then(m => m.ProjectsComponent)
  }
];
```

### 3. OnPush Change Detection
```typescript
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OptimizedComponent {
  // Use signals for reactive state
  data = signal<Data[]>([]);
}
```

### 4. Service Worker Implementation
```typescript
// Enable service worker for caching
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js');
}
```

## 📈 Monitoring & Analytics

### Development Monitoring
- Performance overlay in development mode
- Real-time Core Web Vitals display
- Network condition detection
- Bundle size warnings

### Production Analytics
- Performance metrics sent to analytics
- Error tracking and reporting
- User experience monitoring
- A/B testing support

## 🔧 Build Optimizations

### Angular Build Configuration
```json
{
  "optimization": {
    "scripts": true,
    "styles": {
      "minify": true,
      "inlineCritical": true
    },
    "fonts": true
  },
  "buildOptimizer": true,
  "vendorChunk": true,
  "namedChunks": false
}
```

### Webpack Optimizations
- Tree shaking enabled
- Dead code elimination
- Module concatenation
- Scope hoisting

## 🚨 Performance Alerts

### Bundle Size Alerts
- Warning at 1.5MB initial bundle
- Error at 2MB initial bundle
- Component style warnings at 6KB

### Runtime Monitoring
- Slow connection detection
- Performance degradation alerts
- Memory usage monitoring
- Error rate tracking

## 📋 Performance Checklist

### Before Deployment
- [ ] Run bundle analysis
- [ ] Execute Lighthouse audit
- [ ] Check Core Web Vitals
- [ ] Verify image optimization
- [ ] Test on slow connections
- [ ] Validate accessibility scores

### Regular Monitoring
- [ ] Weekly performance audits
- [ ] Bundle size tracking
- [ ] User experience metrics
- [ ] Error rate monitoring
- [ ] Performance regression testing

## 🔍 Debugging Performance Issues

### Common Issues
1. **Large Bundle Size**
   - Check for duplicate dependencies
   - Implement lazy loading
   - Remove unused imports

2. **Slow Image Loading**
   - Optimize image sizes
   - Use WebP format
   - Implement lazy loading

3. **Poor Core Web Vitals**
   - Optimize critical rendering path
   - Reduce layout shifts
   - Minimize JavaScript execution

### Tools
- Chrome DevTools Performance tab
- Lighthouse CI
- WebPageTest
- Bundle Analyzer reports

## 📚 Additional Resources

- [Web.dev Performance](https://web.dev/performance/)
- [Angular Performance Guide](https://angular.io/guide/performance-guide)
- [Core Web Vitals](https://web.dev/vitals/)
- [Lighthouse Documentation](https://developers.google.com/web/tools/lighthouse)