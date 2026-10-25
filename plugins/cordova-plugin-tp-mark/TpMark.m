/* Generischer Schluesselbund-Eintrag (kSecClassGenericPassword).
   Solche Eintraege loescht iOS beim Entfernen der App nicht; mit
   kSecAttrAccessibleAfterFirstUnlock wandern sie ueber verschluesselte
   Backups auch auf ein neues Geraet mit. */
#import "TpMark.h"
#import <Security/Security.h>

static NSString * const kTpMarkService = @"de.turnierpro.app.mark";

@implementation TpMark

- (NSMutableDictionary*)queryForKey:(NSString*)key
{
    NSMutableDictionary *q = [NSMutableDictionary dictionary];
    q[(__bridge id)kSecClass] = (__bridge id)kSecClassGenericPassword;
    q[(__bridge id)kSecAttrService] = kTpMarkService;
    q[(__bridge id)kSecAttrAccount] = key;
    return q;
}

- (void)get:(CDVInvokedUrlCommand*)command
{
    NSString *key = [command argumentAtIndex:0 withDefault:@"" andClass:[NSString class]];
    [self.commandDelegate runInBackground:^{
        NSMutableDictionary *q = [self queryForKey:key];
        q[(__bridge id)kSecReturnData] = @YES;
        q[(__bridge id)kSecMatchLimit] = (__bridge id)kSecMatchLimitOne;
        CFTypeRef res = NULL;
        OSStatus st = SecItemCopyMatching((__bridge CFDictionaryRef)q, &res);
        NSString *val = @"";
        if (st == errSecSuccess && res != NULL) {
            NSData *data = (__bridge_transfer NSData *)res;
            NSString *s = [[NSString alloc] initWithData:data encoding:NSUTF8StringEncoding];
            if (s != nil) val = s;
        } else if (res != NULL) {
            CFRelease(res);
        }
        CDVPluginResult *r;
        if (st == errSecSuccess || st == errSecItemNotFound) {
            r = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsString:val];
        } else {
            r = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsInt:(int)st];
        }
        [self.commandDelegate sendPluginResult:r callbackId:command.callbackId];
    }];
}

- (void)set:(CDVInvokedUrlCommand*)command
{
    NSString *key = [command argumentAtIndex:0 withDefault:@"" andClass:[NSString class]];
    NSString *value = [command argumentAtIndex:1 withDefault:@"" andClass:[NSString class]];
    [self.commandDelegate runInBackground:^{
        NSData *data = [value dataUsingEncoding:NSUTF8StringEncoding];
        NSMutableDictionary *q = [self queryForKey:key];
        NSDictionary *upd = @{ (__bridge id)kSecValueData: data };
        OSStatus st = SecItemUpdate((__bridge CFDictionaryRef)q, (__bridge CFDictionaryRef)upd);
        if (st == errSecItemNotFound) {
            q[(__bridge id)kSecValueData] = data;
            q[(__bridge id)kSecAttrAccessible] = (__bridge id)kSecAttrAccessibleAfterFirstUnlock;
            st = SecItemAdd((__bridge CFDictionaryRef)q, NULL);
        }
        CDVPluginResult *r = (st == errSecSuccess)
            ? [CDVPluginResult resultWithStatus:CDVCommandStatus_OK]
            : [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsInt:(int)st];
        [self.commandDelegate sendPluginResult:r callbackId:command.callbackId];
    }];
}

@end
